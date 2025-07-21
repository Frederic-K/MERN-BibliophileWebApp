import { Validators, MESSAGES, JoiExtended } from "./validation.constants.js"

// Validation schema for user ID
export const userIdSchema = JoiExtended.object({
  // userId: Validators.objectId({ required: true }),
  userId: Validators.objectId({ required: false }).allow(null, ""),
})

// Validation schema for item ID
export const itemIdSchema = JoiExtended.object({
  itemId: Validators.objectId({ required: true }),
})

// Validation schema for item slug or id
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

// Validation schema for book ID
export const bookIdSchema = JoiExtended.object({
  bookId: Validators.objectId(
    { required: true },
    {
      invalid: "Invalid book ID format",
      required: "Book ID is required",
    }
  ),
})

// Validation schema for multiple book IDs (if needed)
// export const bookIdsSchema = JoiExtended.object({
//   bookIds: Validators.array(
//     Validators.objectId(
//       {},
//       {
//         invalid: "Invalid book ID format in the array",
//       }
//     ),
//     {
//       min: 1,
//       required: true,
//     }
//   ).messages({
//     "array.base": "Book IDs must be an array",
//     "array.min": "At least one book ID is required",
//     "any.required": "Book IDs are required",
//   }),
// })

// Validation schema for entry slug
export const slugSchema = JoiExtended.object({
  slug: Validators.string({
    required: true,
    min: 1,
    max: 200,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  }).messages({
    "string.pattern.base": "Slug must contain only lowercase letters, numbers, and hyphens",
  }),
})

// Validation schema for bookshelf item details
export const updateBookshelfItemDetailsSchema = JoiExtended.object({
  rating: Validators.number({
    min: 1,
    max: 5,
    required: false,
  }).allow(null),

  readStatus: Validators.string().valid("to-read", "reading", "read").default("to-read"),

  startReadDate: Validators.date({
    required: false,
  }).allow(null, ""), // Allow null and empty string

  endReadDate: Validators.date({
    required: false,
  }).allow(null, ""),

  isFavorite: Validators.boolean({
    required: false,
  }),

  dueDate: Validators.date({
    allow: [null, ""],
  }).messages({
    "date.base": MESSAGES.COMMON.date.base,
  }),
})

export const addBookshelfItemSchema = JoiExtended.object({
  rating: Validators.number(
    { min: 1, max: 5, required: false },
    {
      base: "Rating must be a number",
      min: "Rating must be at least 1",
      max: "Rating cannot exceed 5",
    }
  ).allow(null),
  readStatus: Validators.string(
    { valid: ["to-read", "reading", "read"], default: "to-read" },
    { valid: "Invalid read status" }
  ),
  startReadDate: Validators.date({ required: false }, { base: "Invalid start read date" }).allow(
    null,
    ""
  ),
  endReadDate: Validators.date({ required: false }, { base: "Invalid end read date" }).allow(
    null,
    ""
  ),
  isFavorite: Validators.boolean(
    { required: false },
    { base: "Is favorite must be a boolean" }
  ).default(false),
  dueDate: Validators.date(
    { min: "now", required: false },
    {
      base: "Invalid due date",
      min: "Due date must be in the future",
    }
  ).allow(null, ""),
})

export const userReadingDashboardSchema = JoiExtended.object({
  searchTerm: Validators.string().allow(""),
  page: Validators.number().integer().min(1).default(1),
  limit: Validators.number().integer().min(1).max(100).default(10),
  sortBy: Validators.string()
    .valid("title", "author", "rating", "readStatus", "startReadDate", "endReadDate")
    .default("title"),
  sortOrder: Validators.string().valid("asc", "desc").default("asc"),
  readStatus: Validators.string().valid("to-read", "reading", "read"),
  minRating: Validators.number().integer().min(1).max(5),
  isFavorite: Validators.boolean(),
  startDate: Validators.date(),
  endDate: Validators.date(),
})
