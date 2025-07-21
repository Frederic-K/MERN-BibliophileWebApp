import express from "express"
import {
  createWishlistBooks,
  getWishlistBooks,
  updateWishlistBook,
  updateWishlistBooks,
  deleteWishlistBooks,
  deleteAllWishlistBooks,
  sendWishlistBooks,
} from "../controllers/wishlist.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import validate from "../middleware/validation.js"
import {
  userIdSchema,
  wishlistBookIdSchema,
  wishlistBookSchema,
  updateWishlistBookSchema,
  updateWishlistBooksSchema,
  deleteWishlistBooksSchema,
  sendWishlistSchema,
} from "../validations/wishlist.validation.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Create new wishlist books for a user
router.post(
  "/:userId",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.WISHLIST),
  validate({ params: userIdSchema, body: wishlistBookSchema }),
  createWishlistBooks
)

// Get all wishlist books for a specific user
router.get(
  "/:userId",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.WISHLIST),
  validate({ params: userIdSchema }),
  getWishlistBooks
)

// Update a specific wishlist book for a user
router.patch(
  "/:userId/:wishlistBookId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.WISHLIST),
  validate({
    params: userIdSchema.concat(wishlistBookIdSchema),
    body: updateWishlistBookSchema,
  }),
  updateWishlistBook
)

// Update entire wishlist for a user
router.put(
  "/:userId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.WISHLIST),
  validate({ params: userIdSchema, body: updateWishlistBooksSchema }),
  updateWishlistBooks
)

// Delete specific wishlist books for a user
router.delete(
  "/:userId",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.WISHLIST),
  validate({ params: userIdSchema, body: deleteWishlistBooksSchema }),
  deleteWishlistBooks
)

// Delete all wishlist books for a user
router.delete(
  "/:userId/all",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.WISHLIST),
  validate({ params: userIdSchema }),
  deleteAllWishlistBooks
)

// Send wishlist for a user
router.post(
  "/:userId/send",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.WISHLIST),
  validate({ params: userIdSchema, body: sendWishlistSchema }),
  sendWishlistBooks
)

export default router
