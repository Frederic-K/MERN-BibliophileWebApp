import { Validators, MESSAGES, RULES, PATTERNS, JoiExtended } from "./validation.constants.js"

export const userIdSchema = JoiExtended.object({
  userId: Validators.objectId({ required: true }),
})

export const wishlistBookIdSchema = JoiExtended.object({
  wishlistBookId: Validators.objectId({ required: true }),
})

export const wishlistBookSchema = JoiExtended.object({
  books: JoiExtended.array()
    .items(
      JoiExtended.object({
        title: Validators.string({
          min: RULES.TITLE.min,
          max: RULES.TITLE.max,
          required: true,
        }).messages({
          "string.min": MESSAGES.COMMON.string.min,
          "string.max": MESSAGES.COMMON.string.max,
          "any.required": MESSAGES.COMMON.required,
        }),
        author: Validators.string({
          min: RULES.NAME.min,
          max: RULES.NAME.max,
          required: true,
        }).messages({
          "string.min": MESSAGES.COMMON.string.min,
          "string.max": MESSAGES.COMMON.string.max,
          "any.required": MESSAGES.COMMON.required,
        }),
        priority: Validators.string({
          valid: ["high", "medium", "low"],
          required: true,
        }).messages({
          "any.only": MESSAGES.COMMON.string.valid,
          "any.required": MESSAGES.COMMON.required,
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one book is required in the wishlist",
      "any.required": MESSAGES.COMMON.required,
    }),
  status: Validators.string({
    valid: ["pending", "in progress", "completed"],
    default: "pending",
  }).messages({
    "any.only": MESSAGES.COMMON.string.valid,
  }),
})

export const updateWishlistBookSchema = JoiExtended.object({
  title: Validators.string({
    min: RULES.TITLE.min,
    max: RULES.TITLE.max,
    required: false,
  }),
  author: Validators.string({
    min: RULES.NAME.min,
    max: RULES.NAME.max,
    required: false,
  }),
  status: Validators.string({
    valid: ["pending", "in progress", "completed"],
    required: false,
  }),
  priority: Validators.string({
    valid: ["high", "medium", "low"],
    required: false,
  }),
}).min(1)

export const updateWishlistBooksSchema = JoiExtended.object({
  books: JoiExtended.array()
    .items(
      JoiExtended.object({
        _id: Validators.objectId().optional(),
        title: Validators.string({
          min: RULES.TITLE.min,
          max: RULES.TITLE.max,
          required: true,
        }).messages({
          "string.min": MESSAGES.COMMON.string.min,
          "string.max": MESSAGES.COMMON.string.max,
          "any.required": MESSAGES.COMMON.required,
        }),
        author: Validators.string({
          min: RULES.NAME.min,
          max: RULES.NAME.max,
          required: true,
        }).messages({
          "string.min": MESSAGES.COMMON.string.min,
          "string.max": MESSAGES.COMMON.string.max,
          "any.required": MESSAGES.COMMON.required,
        }),
        priority: Validators.string({
          valid: ["high", "medium", "low"],
          required: true,
        }).messages({
          "any.only": MESSAGES.COMMON.string.valid,
          "any.required": MESSAGES.COMMON.required,
        }),
        status: Validators.string({
          valid: ["pending", "in progress", "completed"],
          required: false,
          default: "pending",
        }).messages({
          "any.only": MESSAGES.COMMON.string.valid,
        }),
      })
    )
    .min(0) // Allow empty array to clear wishlist
    .required()
    .messages({
      "array.base": "Books must be an array",
      "any.required": MESSAGES.COMMON.required,
    }),
})

export const deleteWishlistBooksSchema = JoiExtended.object({
  bookIds: JoiExtended.array().items(Validators.objectId()).min(1).required().messages({
    "array.base": "Book IDs must be an array",
    "array.min": "At least one book ID is required",
    "any.required": "Book IDs are required",
  }),
})

export const sendWishlistSchema = JoiExtended.object({
  email: Validators.email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
})
