import { Validators, MESSAGES, RULES, PATTERNS, JoiExtended } from "./validation.constants.js"

// Validation schema for author ID
export const authorIdSchema = JoiExtended.object({
  authorId: Validators.objectId({ required: true }),
})

// Validation schema for fallback author ID
export const fallbackAuthorIdSchema = JoiExtended.object({
  fallbackAuthorId: Validators.objectId({ required: false }).optional(),
})

// Validation schema for author identifier (ID or slug)
export const identifierSchema = JoiExtended.object({
  identifier: Validators.string()
    .required()
    .min(1)
    .max(200)
    .pattern(/^[a-zA-Z0-9-]+$/)
    .messages({
      "string.pattern.base": "Identifier must contain only letters, numbers, and hyphens",
    }),
})

// Validation schema for author
export const authorSchema = JoiExtended.object({
  firstName: Validators.name({
    required: true,
    min: RULES.NAME.min,
    max: RULES.NAME.max,
  }),

  lastName: Validators.name({
    required: true,
    min: RULES.NAME.min,
    max: RULES.NAME.max,
  }),

  birthDate: Validators.date({
    max: "now",
    allow: [null],
  }),

  deathDate: Validators.date({
    min: JoiExtended.ref("birthDate"),
    max: "now",
    allow: [null],
  }),

  bio: Validators.string({
    max: RULES.SUMMARY.max,
    allow: [null, ""],
  }),

  books: Validators.array(Validators.objectId(), {
    required: false,
    default: [],
  }),
})
