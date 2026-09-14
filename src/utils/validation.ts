import * as yup from "yup"

export const bloodRequestSchema = yup.object({
  establishment: yup.string().trim().required("L’établissement est obligatoire."),
  blood_group: yup.string().required("Le groupe sanguin est obligatoire."),
  units: yup.number().integer().min(1).required("La quantité est obligatoire."),
  deadline: yup.string().required("L’échéance est obligatoire."),
  urgency: yup
    .mixed<"normal" | "urgent" | "critique">()
    .oneOf(["normal", "urgent", "critique"])
    .required("Le niveau d’urgence est obligatoire."),
  notes: yup.string().optional(),
})

export const donationSchema = yup.object({
  center_id: yup.number().required(),
  date: yup.string().required("La date est obligatoire."),
  time: yup.string().required("Le créneau est obligatoire."),
})
