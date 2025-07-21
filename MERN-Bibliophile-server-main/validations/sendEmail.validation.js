import { Validators, JoiExtended } from "./validation.constants.js"

// Define sendEmailSchema for sending emails
export const sendEmailSchema = JoiExtended.object({
  to: Validators.email({ required: true }),

  subject: Validators.string({
    min: 1,
    max: 100,
    required: true,
  }),

  html: Validators.string({
    max: 2000,
    required: true,
    allow: [""], // Allow empty string for plain emails
  }),
})
