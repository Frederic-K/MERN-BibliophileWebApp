import express from "express"
import {
  addUserBookshelfItem,
  getUserBookshelfItems,
  getUserBookshelfItem,
  getUserReadingDashboard,
  updateUserBookshelfItem,
  deleteUserBookshelfItem,
  deleteAllUserBookshelfItems,
} from "../controllers/userBookshelf.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import validate from "../middleware/validation.js"
import {
  userIdSchema,
  itemIdSchema,
  bookIdSchema,
  addBookshelfItemSchema,
  updateBookshelfItemDetailsSchema,
  identifierSchema,
  userReadingDashboardSchema,
} from "../validations/userBookshelf.validation.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Add books to a user's bookshelf
router.post(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema, body: bookIdSchema.concat(addBookshelfItemSchema) }),
  addUserBookshelfItem
)

// Get all books in a user's bookshelf
router.get(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema }),
  getUserBookshelfItems
)

// Get the user's reading dashboard data
// Have to be placed before the route to get single bookshelf
// otherwise it will try to read /reading-dashboard as the identifier
router.get(
  "/:userId?/reading-dashboard",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.USER_BOOKSHELF),
  validate({
    params: userIdSchema,
    query: userReadingDashboardSchema,
  }),
  getUserReadingDashboard
)

// Get a single bookshelf item by ID or slug
router.get(
  "/:userId?/:identifier",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema.concat(identifierSchema) }),
  getUserBookshelfItem
)

// Update a specific book item in a user's bookshelf
router.patch(
  "/:userId?/:itemId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema.concat(itemIdSchema), body: updateBookshelfItemDetailsSchema }),
  updateUserBookshelfItem
)

// Delete a specific book item from a user's bookshelf
router.delete(
  "/:userId?/:itemId",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema.concat(itemIdSchema) }),
  deleteUserBookshelfItem
)

// Delete all book items from a user's bookshelf
router.delete(
  "/:userId?/all",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.USER_BOOKSHELF),
  validate({ params: userIdSchema }),
  deleteAllUserBookshelfItems
)

export default router
