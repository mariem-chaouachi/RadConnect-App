const express = require("express");
const { PrismaClient } = require("@prisma/client");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.use(requireAuth);

async function logAudit(caseId, userId, action) {
  await prisma.auditLog.create({ data: { caseId, userId, action } });
}

// CREATE a new case
router.post("/", async (req, res) => {
  try {
    const { modality, priority, note, questionTypes, images } = req.body;
    if (!modality || !priority) {
      return res.status(400).json({ error: "modality and priority are required." });
    }

    const id = `RAD-2026-${Math.floor(1000 + Math.random() * 8999)}`;

    const newCase = await prisma.case.create({
      data: {
        id,
        modality,
        priority,
        status: "pending",
        note: note || null,
        createdById: req.userId,
        questions: { create: (questionTypes || []).map((type) => ({ type })) },
        images: { create: (images || []).map((img) => ({ label: img.label, uploadedById: req.userId })) },
      },
      include: { questions: true, images: true },
    });

    await logAudit(id, req.userId, "created");
    res.status(201).json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// LIST cases
router.get("/", async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      include: { questions: true, images: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET one case (with its messages and audit log too, since the detail screen needs those)
router.get("/:id", async (req, res) => {
  try {
    const c = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        questions: true,
        images: true,
        messages: { orderBy: { sentAt: "asc" } },
        auditLogs: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!c) return res.status(404).json({ error: "Case not found." });

    await logAudit(c.id, req.userId, "viewed");
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// SEND a message (also handles reopening a completed case)
router.post("/:id/messages", async (req, res) => {
  try {
    const { content, replyToText, replyToIsQ } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "content is required." });
    }

    const existingCase = await prisma.case.findUnique({ where: { id: req.params.id } });
    if (!existingCase) return res.status(404).json({ error: "Case not found." });

    const message = await prisma.message.create({
      data: {
        caseId: req.params.id,
        senderId: req.userId,
        content,
        replyToText: replyToText || null,
        replyToIsQ: !!replyToIsQ,
      },
    });

    await logAudit(req.params.id, req.userId, "messaged");

    // Reopen logic: if the case was completed, a new message brings it back to "active"
    if (existingCase.status === "completed") {
      await prisma.case.update({
        where: { id: req.params.id },
        data: { status: "active", completedAt: null },
      });
      await logAudit(req.params.id, req.userId, "reopened");
    }

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ANSWER a structured question
router.patch("/:id/questions/:questionId", async (req, res) => {
  try {
    const { answerText } = req.body;
    if (!answerText) return res.status(400).json({ error: "answerText is required." });

    const question = await prisma.question.update({
      where: { id: req.params.questionId },
      data: { answered: true, answerText, answeredById: req.userId },
    });

    await logAudit(req.params.id, req.userId, "decided");
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// SET case status (complete, active, etc.)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required." });

    const updated = await prisma.case.update({
      where: { id: req.params.id },
      data: { status, completedAt: status === "completed" ? new Date() : null },
    });

    await logAudit(req.params.id, req.userId, status);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ASSIGN a radiologist to a case (self-assign, in practice)
router.patch("/:id/assign", async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({ where: { id: req.params.id } });
    if (!existingCase) return res.status(404).json({ error: "Case not found." });

    const updated = await prisma.case.update({
      where: { id: req.params.id },
      data: {
        assignedToId: req.userId,
        status: existingCase.status === "pending" ? "active" : existingCase.status,
      },
    });

    await logAudit(req.params.id, req.userId, "assigned");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// REQUEST an image (radiologist asks technician for one)
router.post("/:id/request-image", async (req, res) => {
  try {
    const updated = await prisma.case.update({
      where: { id: req.params.id },
      data: { imageRequested: true },
    });

    await logAudit(req.params.id, req.userId, "image_requested");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ADD an image (technician fulfills a request, or adds one anytime)
router.post("/:id/images", async (req, res) => {
  try {
    const { label } = req.body;
    if (!label) return res.status(400).json({ error: "label is required." });

    const image = await prisma.caseImage.create({
      data: { caseId: req.params.id, label, uploadedById: req.userId },
    });

    await prisma.case.update({
      where: { id: req.params.id },
      data: { imageRequested: false },
    });

    await logAudit(req.params.id, req.userId, "image_added");
    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;