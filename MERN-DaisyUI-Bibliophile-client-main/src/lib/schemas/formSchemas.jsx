import * as z from "zod"

// Except for rating (convertion), all other fields validation are useless
// because they are radio btn or checkbox (atm input design not defined)
// and datepicker internaly validate input
export const bookshelfItemSchema = z.object({
  readStatus: z.enum(["to-read", "reading", "read"]),
  startReadDate: z.string().optional().nullable(),
  endReadDate: z.string().optional().nullable(),
  isFavorite: z.boolean(),
  dueDate: z.string().optional().nullable(),
  rating: z.preprocess(
    (val) => (val === "" || val === null ? null : Number(val)),
    z
      .number()
      .min(0, { message: "Rating must be at least 0" })
      .max(5, { message: "Rating must be at most 5" })
      .nullable()
  ),
})

export const authorSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .transform((val) => val.trim()),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  bio: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : val)),
})

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .transform((val) => val.trim())
    .refine((val) => /^[a-zA-ZÀ-ÖØ-öø-ÿœçéèêàâîôûù0-9\s.,!?'"()«»:;°’“”…–&@'-]+$/.test(val), {
      message: "Title must be alphanumeric and can include spaces and punctuation",
    }),
  authorSearch: z.string().min(1, { message: "Author is required" }),
  authorId: z.string().min(1, { message: "Please select an author from the suggestions" }),
  summary: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : val)),
  coverBookImage: z
    .custom(
      (value) => {
        if (value instanceof FileList) {
          return value.length === 0 || value[0] instanceof File
        }
        return value === undefined
      },
      {
        message: "Cover image must be a file or undefined",
      }
    )
    .refine((value) => {
      if (value instanceof FileList && value.length > 0) {
        const file = value[0]
        return file.size <= 1024 * 1024
      }
      return true
    }, "File must be less than 1MB")
    .refine((value) => {
      if (value instanceof FileList && value.length > 0) {
        const file = value[0]
        return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)
      }
      return true
    }, "File must be an image (PNG, JPEG, JPG, or WebP)")
    .optional(),
  publishYear: z
    .union([
      z
        .number()
        .int()
        .min(1000, { message: "Publication year must be at least 1000" })
        .max(new Date().getFullYear() + 5, {
          message: "Publication year cannot be in the far future",
        }),
      z.string().refine((val) => val === "" || /^\d+$/.test(val), {
        message: "Publication year must be a number or empty",
      }),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : Number(val))),
  format: z.enum(["physical", "digital"]).optional(),
  tags: z
    .string()
    .refine((val) => val === "" || /^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$/.test(val), {
      message: "Tags must contain only letters, numbers, spaces, and basic punctuation",
    })
    .transform((val) => (val === "" ? [] : val.split(",").map((tag) => tag.trim())))
    .optional(),
  genre: z
    .string()
    .refine((val) => val === "" || /^[a-zA-ZÀ-ÿ0-9\s.,!?'-]+$/.test(val), {
      message: "Genre must contain only letters, numbers, spaces, and basic punctuation",
    })
    .transform((val) => (val === "" ? [] : val.split(",").map((g) => g.trim())))
    .optional(),
  language: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => /^[a-zA-ZÀ-ÿ]*$/.test(val), {
      message: "Language must contain only letters",
    })
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  pageCount: z
    .preprocess((val) => (val === "" ? undefined : parseInt(val, 10)), z.number().optional())
    .refine((val) => val === undefined || !isNaN(val), { message: "Page count must be a number" }),
  availability: z.enum(["available", "unavailable", "reserved"]).optional(),
  // dueDate: z
  //   .string()
  //   .refine((val) => val === "" || !isNaN(Date.parse(val)), {
  //     message: "Invalid date format",
  //   })
  //   .refine(
  //     (val) => {
  //       if (val === "") return true
  //       const date = new Date(val)
  //       const today = new Date()
  //       return date >= today
  //     },
  //     {
  //       message: "Due date must be today or in the future",
  //     }
  //   )
  //   .transform((val) => (val === "" ? undefined : new Date(val).toISOString()))
  //   .optional(),
  // readStatus: z.enum(["unread", "reading", "read"]).optional(),
  // rating: z
  //   .preprocess(
  //     (val) => (val === "" ? undefined : parseFloat(val)),
  //     z.number().default(1).optional()
  //   )
  //   .refine((val) => val === undefined || !isNaN(val), { message: "Rating must be a number" }),
})

export const forgotPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    confirmEmail: z.string().email({ message: "Invalid email address" }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
  })

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })

export const signInSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "Username is required" })
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .transform((val) => val.trim()),
})

export const signUpSchema = z
  .object({
    userName: z
      .string()
      .min(1, { message: "userName is required" })
      .transform((val) => val.trim()),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .transform((val) => val.trim()),
    confirmEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .transform((val) => val.trim()),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .transform((val) => val.trim()),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
  })

export const userSchema = z
  .object({
    userName: z
      .string()
      .min(1, { message: "userName is required" })
      .refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
        message: "Username must be alphanumeric",
      }),
    newEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    confirmNewEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .optional()
      .or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Check if newEmail and confirmNewEmail match
      if (data.newEmail || data.confirmNewEmail) {
        return data.newEmail === data.confirmNewEmail
      }
      return true
    },
    {
      message: "New emails don't match",
      path: ["confirmNewEmail"],
    }
  )
  .refine(
    (data) => {
      // If any password field is filled, all password fields become required
      const passwordFieldsFilled =
        data.currentPassword || data.newPassword || data.confirmNewPassword
      if (passwordFieldsFilled) {
        if (!data.currentPassword || !data.newPassword || !data.confirmNewPassword) {
          return false
        }
        if (data.newPassword !== data.confirmNewPassword) {
          return false
        }
        if (data.newPassword.length < 6) {
          return false
        }
      }
      return true
    },
    {
      message: "All password fields are required and must meet the criteria",
      path: ["newPassword"],
    }
  )

export const wishListSchema = z.object({
  bookTitle: z.string().min(1, "Book title is required"),
  bookAuthor: z.string().min(1, "Author name is required"),
  priority: z.enum(["low", "medium", "high"]).default("high"),
})

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})
