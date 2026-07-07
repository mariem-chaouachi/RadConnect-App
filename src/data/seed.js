export const uid = () => Math.random().toString(36).slice(2, 9);
export const now = () => Date.now();

export function timeAgo(ts) {
  const diff = Math.max(0, now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Pre-seeded demo accounts so the app is usable immediately without signing up.
export const DEMO_USERS = [
  {
    id: "u1", role: "technician", firstName: "Amine", lastName: "Ben Ali",
    licenseId: "TECH-3391", specialization: "General radiography", email: "amine.tech@radconnect.demo",
    phone: "+216 20 111 222", password: "demo1234", initials: "AB",
  },
  {
    id: "u2", role: "radiologist", firstName: "Sami", lastName: "Trabelsi",
    licenseId: "RAD-1187", specialization: "Musculoskeletal radiology", email: "sami.rad@radconnect.demo",
    phone: "+216 20 333 444", password: "demo1234", initials: "ST",
  },
];

export function seedCases(techId, radId) {
  const t0 = now() - 1000 * 60 * 42;
  const t1 = now() - 1000 * 60 * 8;
  const t2 = now() - 1000 * 60 * 60 * 3;
  return [
    {
      id: "RAD-2026-0731", modality: "xray", priority: "emergency", status: "active",
      createdBy: techId, assignedRadiologist: radId, createdAt: t1, completedAt: null,
      note: "Suspected fracture, patient in significant pain, needs urgent read.",
      questions: [
        { id: uid(), type: "additional_view", answered: false, answerText: null, answeredBy: null },
        { id: uid(), type: "quality", answered: false, answerText: null, answeredBy: null },
      ],
      images: [{ id: uid(), label: "Wrist AP" }],
    },
    {
      id: "RAD-2026-0729", modality: "ct", priority: "urgent", status: "pending",
      createdBy: techId, assignedRadiologist: null, createdAt: t2, completedAt: null,
      note: "Abdominal CT, unsure if contrast protocol was followed correctly.",
      questions: [{ id: uid(), type: "contrast", answered: false, answerText: null, answeredBy: null }],
      images: [{ id: uid(), label: "Abdomen axial" }],
    },
    {
      id: "RAD-2026-0725", modality: "mri", priority: "normal", status: "completed",
      createdBy: techId, assignedRadiologist: radId, createdAt: t0, completedAt: now() - 1000 * 60 * 20,
      note: "Routine knee MRI, protocol confirmation only.",
      questions: [{ id: uid(), type: "quality", answered: true, answerText: "Yes, quality is sufficient.", answeredBy: radId }],
      images: [{ id: uid(), label: "Knee sagittal" }],
    },
  ];
}

export function seedMessages(techId, radId) {
  return [
    { id: uid(), caseId: "RAD-2026-0731", senderId: techId, content: "Patient can't fully extend the wrist. Should I get an oblique view too?", sentAt: now() - 1000 * 60 * 7 },
    { id: uid(), caseId: "RAD-2026-0731", senderId: radId, content: "Yes, please add an oblique. I'll wait for it before reading.", sentAt: now() - 1000 * 60 * 5 },
    { id: uid(), caseId: "RAD-2026-0725", senderId: radId, content: "Series looks clean, no repeat needed. Closing this one out.", sentAt: now() - 1000 * 60 * 21 },
  ];
}

export function seedAudit(techId, radId) {
  return [
    { id: uid(), caseId: "RAD-2026-0731", userId: techId, action: "created", createdAt: now() - 1000 * 60 * 8 },
    { id: uid(), caseId: "RAD-2026-0731", userId: radId, action: "viewed", createdAt: now() - 1000 * 60 * 7 },
    { id: uid(), caseId: "RAD-2026-0731", userId: radId, action: "messaged", createdAt: now() - 1000 * 60 * 5 },
    { id: uid(), caseId: "RAD-2026-0725", userId: radId, action: "completed", createdAt: now() - 1000 * 60 * 20 },
  ];
}
