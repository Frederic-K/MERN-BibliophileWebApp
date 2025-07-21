import { JoiExtended, Validators } from "./validation.constants.js"

export const searchSchema = JoiExtended.object({
  searchType: Validators.string(
    { valid: ["books", "bookshelf", "authors", "users"] },
    { required: "Search type is required", valid: "Invalid search type" }
  ).required(),

  userId: Validators.objectId({ required: false }).allow(null, ""),

  searchTerm: Validators.string(
    { min: 1, max: 100 },
    {
      min: "Search term must be at least 1 character long",
      max: "Search term cannot exceed 100 characters",
    }
  )
    .allow("")
    .optional(),

  sortBy: Validators.string(
    {
      valid: [
        "title",
        "author",
        "rating",
        "readStatus",
        "startReadDate",
        "endReadDate",
        "firstName",
        "lastName",
        "username",
        "email",
      ],
    },
    {
      valid:
        'Sort by must be one of the following: "title", "author", "rating", "readStatus", "startReadDate", "endReadDate", "firstName", "lastName", "username", or "email"',
    }
  ).default("title"),

  sortOrder: Validators.string(
    { valid: ["asc", "desc"] },
    { valid: 'Sort order must be either "asc" or "desc"' }
  ).default("desc"),

  format: Validators.string(
    { valid: ["All", "physical", "digital"] },
    { valid: 'Format must be "All", "physical", or "digital"' }
  ).default("All"),

  minRating: Validators.number(
    { integer: true, min: 1, max: 5 },
    {
      integer: "Minimum rating must be a whole number",
      min: "Minimum rating must be at least 1",
      max: "Minimum rating cannot exceed 5",
    }
  ).default(1),

  readStatus: Validators.string(
    { valid: ["All", "to-read", "reading", "read"] },
    { valid: 'Read status must be "All", "to-read", "reading", or "read"' }
  ).default("All"),

  availabilityStatus: Validators.string(
    { valid: ["All", "available", "unavailable", "reserved"] },
    { valid: 'Availability status must be "All", "available", "unavailable", or "reserved"' }
  ).default("All"),

  page: Validators.number(
    { integer: true, min: 1 },
    {
      integer: "Page must be a whole number",
      min: "Page must be at least 1",
    }
  ).default(1),

  limit: Validators.number(
    { integer: true, min: 1, max: 100 },
    {
      integer: "Limit must be a whole number",
      min: "Limit must be at least 1",
      max: "Limit cannot exceed 100",
    }
  ).default(10),

  userInfo: Validators.string(
    { pattern: /^[a-zA-Z+]+$/ },
    { valid: 'userInfo must be a string of letters separated by "+" signs' }
  ).optional(),

  authorInfo: Validators.string(
    { pattern: /^[a-zA-Z+]+$/ },
    { valid: 'userInfo must be a string of letters separated by "+" signs' }
  ).optional(),

  bookInfo: Validators.string(
    { pattern: /^[a-zA-Z+]+$/ },
    { valid: 'userInfo must be a string of letters separated by "+" signs' }
  ).optional(),
})
