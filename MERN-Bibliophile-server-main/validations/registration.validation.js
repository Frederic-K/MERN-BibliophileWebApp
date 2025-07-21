import { Validators, JoiExtended } from "./validation.constants.js"

// Validation schema for registration status
export const registrationStatusSchema = JoiExtended.object({
  isOpen: Validators.boolean({
    required: true,
  }),
  message: Validators.string({
    required: false,
    allow: [""],
    max: 200,
  }),
})
