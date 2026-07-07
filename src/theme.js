export const theme = {
  paper: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#16213A",
  inkSoft: "#5C6779",
  line: "#DEE3EE",

  // Main brand color — blue
  blue: "#1D5FBF",
  blueSoft: "#E4EDFB",
  blueDark: "#123D80",

  // Priority / status semantics (unchanged meaning, kept distinct from brand blue)
  coral: "#B23A25",
  coralSoft: "#F7E6E1",
  amber: "#B4791A",
  amberSoft: "#FBEEDA",
  sage: "#43724A",
  sageSoft: "#E7F0E6",

  radius: 12,
  radiusSm: 8,
};

export const PRIORITIES = {
  emergency: { label: "Emergency", fg: "coral", bg: "coralSoft" },
  urgent: { label: "Urgent", fg: "amber", bg: "amberSoft" },
  normal: { label: "Normal", fg: "sage", bg: "sageSoft" },
};

export const STATUSES = {
  pending: { label: "Pending", fg: "inkSoft", bg: "line" },
  active: { label: "Active", fg: "blue", bg: "blueSoft" },
  completed: { label: "Completed", fg: "sage", bg: "sageSoft" },
};

export const MODALITIES = [
  { id: "xray", label: "X-ray" },
  { id: "ct", label: "CT" },
  { id: "mri", label: "MRI" },
  { id: "ultrasound", label: "Ultrasound" },
  { id: "nuclear_medicine", label: "Nuclear medicine" },
];

export const QUESTION_LABELS = {
  contrast: "Administer contrast media?",
  additional_view: "Additional projections needed?",
  quality: "Is image quality sufficient?",
  repeat_exam: "Should the exam be repeated?",
};
