const dict = {
  en: {
    appName: "RadConnect",
    tagline: "Secure radiology workflow & communication",
    signOut: "Sign out",

    nav: { dashboard: "Dashboard", newCase: "New case", notifications: "Notifications" },

    role: {
      technician: "Technician",
      radiologist: "Radiologist",
      technicianLong: "Radiology technician",
      radiologistLong: "Radiologist",
    },

    signin: {
      subtitle: "Secure radiology workflow & communication",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      error: "Email or password is incorrect.",
      newHere: "New here? Create an account",
      demoTitle: "Demo accounts",
      demoTechnician: "Technician — amine.tech@radconnect.demo / demo1234",
      demoRadiologist: "Radiologist — sami.rad@radconnect.demo / demo1234",
    },

    signup: {
      title: "Create your account",
      subtitle: "Used once, on your first sign-in",
      iAmA: "I am a",
      firstName: "First name",
      lastName: "Last name",
      licenseIdRad: "Medical license / ID",
      licenseIdTech: "Technician ID",
      specializationRad: "Specialization",
      specializationTech: "Imaging specialization / department",
      specializationPlaceholderRad: "e.g. Musculoskeletal radiology",
      specializationPlaceholderTech: "e.g. CT & general radiography",
      email: "Email",
      phone: "Phone number",
      password: "Password",
      passwordPlaceholder: "At least 6 characters",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Re-enter password",
      createAccount: "Create account",
      alreadyHaveAccount: "Already have an account? Sign in",
      errFillAll: "Please fill in every field.",
      errPasswordLength: "Password must be at least 6 characters.",
      errPasswordMismatch: "Passwords don't match.",
      errEmailExists: "An account with this email already exists.",
    },

    filter: { all: "All", pending: "Pending", active: "Active", completed: "Completed", open: "Needs attention" },

    dashboard: {
      heading: "Case queue",
      emergencyTitle: "Emergency queue",
      emergencySub: "— needs immediate response",
      emptyLabel: "No cases in this view",
      emptySub: "Cases you create or that get assigned to you will show up here.",
      openQuestions: "{n} open",
      awaitingYou: "Needs your reply",
      awaitingTech: "You replied · pending tech",
    },

    priority: { emergency: "Emergency", urgent: "Urgent", normal: "Normal" },
    status: { pending: "Pending", active: "Active", completed: "Completed" },

    modality: {
      xray: "X-ray", ct: "CT", mri: "MRI", ultrasound: "Ultrasound", nuclear_medicine: "Nuclear medicine",
    },

    question: {
      contrast: "Administer contrast media?",
      additional_view: "Additional projections needed?",
      quality: "Is image quality sufficient?",
      repeat_exam: "Should the exam be repeated?",
    },

    newcase: {
      heading: "New imaging case",
      modality: "Modality",
      patientId: "Patient identifier (anonymized)",
      patientIdPlaceholder: "e.g. ANON-4471",
      priority: "Priority",
      questions: "Clinical questions for the radiologist",
      note: "Note (optional)",
      notePlaceholder: "Anything else the radiologist should know…",
      cancel: "Cancel",
      createCase: "Create case",
    },

    casedetail: {
      back: "Back to queue",
      imaging: "Imaging",
      conversation: "Conversation",
      previewNote: "Preview only — full studies remain in PACS.",
      noImages: "No images attached.",
      waiting: "Waiting on radiologist…",
      yes: "Yes",
      no: "No",
      assignToMe: "Assign to me",
      markCompleted: "Mark completed",
      writeMessage: "Write a message…",
      noMessages: "No messages yet.",
      replyingTo: "Replying to {name}: {text}",
      questionPrefix: "Question: ",
      auditTrail: "Audit trail ({n})",
    },

    audit: {
      created: "created", viewed: "viewed", messaged: "messaged",
      decided: "decided", completed: "completed", assigned: "assigned", active: "active",
    },

    notifications: {
      heading: "Notifications",
      emptyLabel: "You're all caught up",
      emptySub: "New case activity for your role will appear here.",
      updates: "{n} updates",
    },
  },

  fr: {
    appName: "RadConnect",
    tagline: "Communication sécurisée pour le flux de travail en radiologie",
    signOut: "Déconnexion",

    nav: { dashboard: "Tableau de bord", newCase: "Nouveau cas", notifications: "Notifications" },

    role: {
      technician: "Technicien",
      radiologist: "Radiologue",
      technicianLong: "Technicien en radiologie",
      radiologistLong: "Radiologue",
    },

    signin: {
      subtitle: "Communication sécurisée pour le flux de travail en radiologie",
      email: "Email",
      password: "Mot de passe",
      signIn: "Se connecter",
      error: "Email ou mot de passe incorrect.",
      newHere: "Nouveau ici ? Créer un compte",
      demoTitle: "Comptes de démonstration",
      demoTechnician: "Technicien — amine.tech@radconnect.demo / demo1234",
      demoRadiologist: "Radiologue — sami.rad@radconnect.demo / demo1234",
    },

    signup: {
      title: "Créez votre compte",
      subtitle: "Utilisé une seule fois, lors de votre première connexion",
      iAmA: "Je suis",
      firstName: "Prénom",
      lastName: "Nom",
      licenseIdRad: "Licence médicale / ID",
      licenseIdTech: "ID technicien",
      specializationRad: "Spécialisation",
      specializationTech: "Spécialisation / service d'imagerie",
      specializationPlaceholderRad: "ex. Radiologie ostéo-articulaire",
      specializationPlaceholderTech: "ex. CT et radiographie générale",
      email: "Email",
      phone: "Numéro de téléphone",
      password: "Mot de passe",
      passwordPlaceholder: "Au moins 6 caractères",
      confirmPassword: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Ressaisir le mot de passe",
      createAccount: "Créer le compte",
      alreadyHaveAccount: "Vous avez déjà un compte ? Se connecter",
      errFillAll: "Veuillez remplir tous les champs.",
      errPasswordLength: "Le mot de passe doit contenir au moins 6 caractères.",
      errPasswordMismatch: "Les mots de passe ne correspondent pas.",
      errEmailExists: "Un compte avec cet email existe déjà.",
    },

    filter: { all: "Tous", pending: "En attente", active: "Actifs", completed: "Terminés", open: "À traiter" },

    dashboard: {
      heading: "File des cas",
      emergencyTitle: "File des urgences",
      emergencySub: "— réponse immédiate requise",
      emptyLabel: "Aucun cas dans cette vue",
      emptySub: "Les cas que vous créez ou qui vous sont assignés apparaîtront ici.",
      openQuestions: "{n} en attente",
      awaitingYou: "Nécessite votre réponse",
      awaitingTech: "Répondu · en attente du technicien",
    },

    priority: { emergency: "Urgence", urgent: "Urgent", normal: "Normal" },
    status: { pending: "En attente", active: "Actif", completed: "Terminé" },

    modality: {
      xray: "Radiographie", ct: "Scanner", mri: "IRM", ultrasound: "Échographie", nuclear_medicine: "Médecine nucléaire",
    },

    question: {
      contrast: "Faut-il administrer un produit de contraste ?",
      additional_view: "Des incidences supplémentaires sont-elles nécessaires ?",
      quality: "La qualité de l'image est-elle suffisante ?",
      repeat_exam: "L'examen doit-il être refait ?",
    },

    newcase: {
      heading: "Nouveau cas d'imagerie",
      modality: "Modalité",
      patientId: "Identifiant patient (anonymisé)",
      patientIdPlaceholder: "ex. ANON-4471",
      priority: "Priorité",
      questions: "Questions cliniques pour le radiologue",
      note: "Note (facultatif)",
      notePlaceholder: "Toute autre information utile pour le radiologue…",
      cancel: "Annuler",
      createCase: "Créer le cas",
    },

    casedetail: {
      back: "Retour à la file",
      imaging: "Imagerie",
      conversation: "Conversation",
      previewNote: "Aperçu uniquement — les études complètes restent dans le PACS.",
      noImages: "Aucune image jointe.",
      waiting: "En attente du radiologue…",
      yes: "Oui",
      no: "Non",
      assignToMe: "M'assigner ce cas",
      markCompleted: "Marquer comme terminé",
      writeMessage: "Écrire un message…",
      noMessages: "Aucun message pour l'instant.",
      replyingTo: "Réponse à {name} : {text}",
      questionPrefix: "Question : ",
      auditTrail: "Journal d'audit ({n})",
    },

    audit: {
      created: "créé", viewed: "consulté", messaged: "message envoyé",
      decided: "décision prise", completed: "terminé", assigned: "assigné", active: "activé",
    },

    notifications: {
      heading: "Notifications",
      emptyLabel: "Vous êtes à jour",
      emptySub: "Les nouvelles activités concernant votre rôle apparaîtront ici.",
      updates: "{n} mises à jour",
    },
  },
};

export function translate(lang, path, vars) {
  const parts = path.split(".");
  let node = dict[lang] || dict.en;
  for (const p of parts) {
    node = node?.[p];
    if (node === undefined) break;
  }
  if (node === undefined) {
    // fallback to English if a key is missing in the active language
    node = dict.en;
    for (const p of parts) node = node?.[p];
  }
  if (typeof node !== "string") return path;
  if (vars) {
    return Object.keys(vars).reduce((str, key) => str.replace(`{${key}}`, vars[key]), node);
  }
  return node;
}

export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];