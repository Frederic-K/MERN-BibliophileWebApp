import express from "express"
import {
  createAuthor,
  getAuthors,
  // getAuthor,
  getAuthorInfo,
  getAuthorBooks,
  updateAuthor,
  deleteAuthor,
} from "../controllers/author.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import validate from "../middleware/validation.js"
import checkPermission from "../middleware/checkPermission.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"
import {
  identifierSchema,
  authorIdSchema,
  authorSchema,
  fallbackAuthorIdSchema,
} from "../validations/author.validation.js"

const router = express.Router()

// Route to create a new author
router.post(
  "/",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.AUTHOR),
  validate({ body: authorSchema }),
  createAuthor
)

// Route to get all authors
router.get("/", checkAuthenticated, checkPermission(ACTIONS.READ, RESOURCES.AUTHOR), getAuthors)

// Route to get a specific author by ID or slug
router.get(
  "/:identifier",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.AUTHOR),
  validate({ params: identifierSchema }),
  getAuthorInfo
)

router.get(
  "/:identifier/books",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.AUTHOR),
  validate({ params: identifierSchema }),
  getAuthorBooks
)

// Route to update an author
router.patch(
  "/:authorId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.AUTHOR),
  validate({ params: authorIdSchema, body: authorSchema }),
  updateAuthor
)

// Route to delete an author
router.delete(
  "/:authorId",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.AUTHOR),
  validate({ params: authorIdSchema, query: fallbackAuthorIdSchema }),
  deleteAuthor
)

// Delete req exemple for client side :
// DELETE /authors/:authorId?fallbackAuthorId=someObjectId

export default router
