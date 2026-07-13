// Translates a raw case object from the backend into the shape the existing
// screens were built around. This exists so we didn't have to rewrite every
// screen's field names to match the database — one translation layer instead.
export function normalizeCase(raw) {
  return {
    id: raw.id,
    modality: raw.modality,
    priority: raw.priority,
    status: raw.status,
    note: raw.note,
    imageRequested: raw.imageRequested,
    createdBy: raw.createdById,
    assignedRadiologist: raw.assignedToId,
    createdAt: new Date(raw.createdAt).getTime(),
    completedAt: raw.completedAt ? new Date(raw.completedAt).getTime() : null,

    questions: (raw.questions || []).map((q) => ({
      id: q.id,
      type: q.type,
      answered: q.answered,
      answerText: q.answerText,
      answeredBy: q.answeredById,
    })),

    images: (raw.images || []).map((img) => ({
      id: img.id,
      label: img.label,
    })),

    messages: (raw.messages || []).map((m) => ({
      id: m.id,
      caseId: m.caseId,
      senderId: m.senderId,
      content: m.content,
      sentAt: new Date(m.sentAt).getTime(),
      replyTo: m.replyToText ? { text: m.replyToText, isQuestion: m.replyToIsQ } : null,
    })),

    auditLogs: (raw.auditLogs || []).map((a) => ({
      id: a.id,
      caseId: a.caseId,
      userId: a.userId,
      action: a.action,
      createdAt: new Date(a.createdAt).getTime(),
    })),
  };
}