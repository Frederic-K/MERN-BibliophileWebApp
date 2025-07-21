import { Validators, MESSAGES, RULES, JoiExtended } from "./validation.constants.js"

export const bookIdSchema = JoiExtended.object({
  bookId: Validators.objectId({ required: true }),
})

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

export const bookSchema = JoiExtended.object({
  title: Validators.string({
    min: RULES.TITLE.min,
    max: RULES.TITLE.max,
    required: true,
  }).messages({
    "string.min": MESSAGES.COMMON.string.min,
    "string.max": MESSAGES.COMMON.string.max,
    "any.required": MESSAGES.COMMON.required,
  }),

  authors: Validators.array(Validators.objectId(), { min: 1, required: true }).messages({
    "array.min": MESSAGES.COMMON.array.min,
    "any.required": MESSAGES.COMMON.required,
  }),

  publishYear: Validators.number({
    integer: true,
    min: 1000,
    max: new Date().getFullYear() + 5,
  })
    .allow(null)
    .messages({
      "number.base": MESSAGES.COMMON.number.base,
      "number.integer": MESSAGES.COMMON.number.integer,
      "number.min": MESSAGES.COMMON.number.min,
      "number.max": MESSAGES.COMMON.number.max,
    }),

  summary: Validators.string({
    max: RULES.SUMMARY.max,
    allow: [null, ""],
  }).messages({
    "string.max": MESSAGES.COMMON.string.max,
  }),

  coverBookImage: Validators.string().uri().allow(null, "").messages({
    "string.uri": MESSAGES.COMMON.string.uri,
  }),

  tags: Validators.array(Validators.string({ max: 50 }), { required: false })
    .allow(null)
    .messages({
      "string.max": MESSAGES.COMMON.string.max,
    }),

  format: Validators.string({
    valid: ["physical", "digital"],
    required: true,
  }).messages({
    "any.only": MESSAGES.COMMON.string.valid,
    "any.required": MESSAGES.COMMON.required,
  }),

  availability: Validators.string({
    valid: ["available", "unavailable", "reserved"],
    default: "available",
  }).messages({
    "any.only": MESSAGES.COMMON.string.valid,
  }),

  genre: Validators.array(Validators.string({ max: 50 }), { required: false })
    .allow(null)
    .messages({
      "string.max": MESSAGES.COMMON.string.max,
    }),

  pageCount: Validators.number({
    integer: true,
    min: 1,
  })
    .allow(null)
    .messages({
      "number.base": MESSAGES.COMMON.number.base,
      "number.integer": MESSAGES.COMMON.number.integer,
      "number.min": MESSAGES.COMMON.number.min,
    }),

  language: Validators.string({
    max: 50,
    allow: [null, ""],
  }).messages({
    "string.max": MESSAGES.COMMON.string.max,
  }),
})

export const bookUpdateSchema = JoiExtended.object({
  title: Validators.string({
    min: RULES.TITLE.min,
    max: RULES.TITLE.max,
  }).messages({
    "string.min": MESSAGES.COMMON.string.min,
    "string.max": MESSAGES.COMMON.string.max,
  }),

  authors: Validators.array(Validators.objectId(), { min: 1 }).messages({
    "array.min": MESSAGES.COMMON.array.min,
  }),

  publishYear: Validators.number({
    integer: true,
    min: 1000,
    max: new Date().getFullYear() + 5,
  })
    .allow(null)
    .messages({
      "number.base": MESSAGES.COMMON.number.base,
      "number.integer": MESSAGES.COMMON.number.integer,
      "number.min": MESSAGES.COMMON.number.min,
      "number.max": MESSAGES.COMMON.number.max,
    }),

  summary: Validators.string({
    max: RULES.SUMMARY.max,
    allow: [null, ""],
  }).messages({
    "string.max": MESSAGES.COMMON.string.max,
  }),

  coverBookImage: Validators.string().uri().allow(null, "").messages({
    "string.uri": MESSAGES.COMMON.string.uri,
  }),

  tags: Validators.array(Validators.string({ max: 50 }))
    .allow(null)
    .messages({
      "string.max": MESSAGES.COMMON.string.max,
    }),

  format: Validators.string({
    valid: ["physical", "digital"],
  }).messages({
    "any.only": MESSAGES.COMMON.string.valid,
  }),

  availability: Validators.string({
    valid: ["available", "unavailable", "reserved"],
  }).messages({
    "any.only": MESSAGES.COMMON.string.valid,
  }),

  genre: Validators.array(Validators.string({ max: 50 }))
    .allow(null)
    .messages({
      "string.max": MESSAGES.COMMON.string.max,
    }),

  pageCount: Validators.number({
    integer: true,
    min: 1,
  })
    .allow(null)
    .messages({
      "number.base": MESSAGES.COMMON.number.base,
      "number.integer": MESSAGES.COMMON.number.integer,
      "number.min": MESSAGES.COMMON.number.min,
    }),

  language: Validators.string({
    max: 50,
    allow: [null, ""],
  }).messages({
    "string.max": MESSAGES.COMMON.string.max,
  }),
}).min(1)
