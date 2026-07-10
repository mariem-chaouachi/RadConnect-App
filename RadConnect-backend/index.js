const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const requireAuth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "RadConnect backend is running" });
});

app.use("/auth", authRoutes);
app.use("/cases", caseRoutes);

app.get("/me", requireAuth, async (req, res) => {
  res.json({ userId: req.userId, role: req.userRole });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});