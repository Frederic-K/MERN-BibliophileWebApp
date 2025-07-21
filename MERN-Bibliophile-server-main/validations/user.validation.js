import { Validators, JoiExtended } from "./validation.constants.js"

// Validation schema for user ID
export const userIdSchema = JoiExtended.object({
  userId: Validators.objectId({ required: true }),
})

// Validation schema for creating a new user
export const createUserSchema = JoiExtended.object({
  userName: Validators.username({ required: true }),
  email: Validators.email({ required: true }),
  password: Validators.password({ required: true }),
  role: Validators.string({
    valid: ["admin", "user", "moderator"],
    required: false,
  }),
})

// Validation schema for updating a user
export const updateUserSchema = JoiExtended.object({
  userName: Validators.username({ required: false }),
  role: Validators.string({
    valid: ["admin", "user", "moderator"],
    required: false,
  }),
  profileImage: Validators.url({ allow: [""] }),
}).or("userName", "role", "profileImage")

// Validation schema for updating user's books
export const updateUserBooksSchema = JoiExtended.object({
  books: Validators.array(Validators.objectId(), { required: true }),
})

// Validation schema for updating user's wishlist
export const updateUserWishlistSchema = JoiExtended.object({
  wishlist: Validators.array(Validators.objectId(), { required: true }),
})
