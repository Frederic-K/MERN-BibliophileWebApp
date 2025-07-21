import express, { query } from "express"
import {
  createBook,
  getBooks,
  getBookInfo,
  getBookAuthors,
  uploadBookCover,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import validate from "../middleware/validation.js"
import {
  bookIdSchema,
  identifierSchema,
  bookSchema,
  bookUpdateSchema,
} from "../validations/book.validation.js"
import { imageUpload } from "../config/upload.config.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Create a book - only admins can create books
router.post(
  "/",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.BOOK),
  validate({ body: bookSchema }),
  createBook
)

// Get all books - all authenticated users can list books
router.get("/", checkAuthenticated, checkPermission(ACTIONS.READ, RESOURCES.BOOK), getBooks)

// Get a book by ID or slug - all authenticated users can read books
router.get(
  "/:identifier",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.BOOK),
  validate({ params: identifierSchema }),
  getBookInfo
)

router.get(
  "/:identifier/authors",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.BOOK),
  validate({ params: identifierSchema }),
  getBookAuthors
)

// Update a book by ID - only admins can update books
router.patch(
  "/:bookId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.BOOK),
  validate({ params: bookIdSchema, body: bookUpdateSchema }),
  updateBook
)

// Upload a book cover - only admins can upload book covers
router.post(
  "/:bookId/upload-cover",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.BOOK),
  validate({ params: bookIdSchema }),
  imageUpload.single("coverBookImage"),
  uploadBookCover
)

// Delete a book by ID - only admins can delete books
router.delete(
  "/:bookId",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.BOOK),
  validate({ params: bookIdSchema }),
  deleteBook
)

export default router
