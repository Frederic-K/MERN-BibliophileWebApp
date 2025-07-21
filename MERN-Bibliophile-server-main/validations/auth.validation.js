import { Validators, MESSAGES, JoiExtended } from "./validation.constants.js"

// Validation schema for user ID
export const userIdSchema = JoiExtended.object({
  userId: Validators.objectId({ required: true }),
})

// Validation schema for token
export const tokenSchema = JoiExtended.object({
  token: Validators.string({ required: true }),
})

// Validation schema for registration
export const signUpSchema = JoiExtended.object({
  userName: Validators.username({ required: true }),
  email: Validators.email({ required: true }),
  password: Validators.password({ required: true }),
  language: Validators.string({ required: true }),
})

// Validation schema for sign in request
export const signInSchema = JoiExtended.object({
  userName: JoiExtended.alternatives()
    .try(Validators.username({ required: true }), Validators.email({ required: true }))
    .messages({
      "any.required": "Username or email is required",
    }),
  password: Validators.password({ required: true }),
})

// Validation schema for update password
export const updatePasswordSchema = JoiExtended.object({
  currentPassword: Validators.password({ required: true }),
  newPassword: Validators.password({ required: true }),
  confirmNewPassword: Validators.string(
    { required: true },
    { "any.only": MESSAGES.PASSWORD.match }
  ).valid(JoiExtended.ref("newPassword")),
})

// Schema for password reset request
export const forgotPasswordSchema = JoiExtended.object({
  email: Validators.email({ required: true }),
  language: Validators.string({ required: true }),
})

// Schema for password reset with token (body only)
export const resetPasswordBodySchema = JoiExtended.object({
  newPassword: Validators.password({ required: true }),
  confirmNewPassword: Validators.string(
    { required: true },
    { "any.only": MESSAGES.PASSWORD.match }
  ).valid(JoiExtended.ref("newPassword")),
})

// Schema for update email (body only)
export const updateEmailBodySchema = JoiExtended.object({
  newEmail: Validators.email({ required: true }),
  language: Validators.string({ required: true }),
})
