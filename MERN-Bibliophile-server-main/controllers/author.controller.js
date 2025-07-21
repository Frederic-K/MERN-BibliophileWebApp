import mongoose from "mongoose"
import Author from "../models/author.model.js"
import Book from "../models/book.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"
import slugify from "slugify"

// Create a new author
export const createAuthor = async (req, res, next) => {
  const { firstName, lastName, bio, birthDate, books } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Generate a slug for the author with timestamp
    const slugBase = slugify(firstName + "-" + lastName, { lower: true, strict: true })
    const timestamp = Date.now()
    const slug = `${slugBase}-${timestamp}`

    const newAuthor = new Author({
      firstName,
      lastName,
      bio,
      birthDate,
      books,
      slug,
    })

    const savedAuthor = await newAuthor.save({ session })

    if (books && books.length > 0) {
      await Book.updateMany(
        { _id: { $in: books } },
        { $addToSet: { authors: savedAuthor._id } },
        { session }
      )
    }

    await session.commitTransaction()

    logger.info(`Author created: ${savedAuthor._id} with slug: ${savedAuthor.slug}`)
    res.status(201).json(savedAuthor)
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error creating author: ${error.message}`)
    next(createError(error.message, 500))
  } finally {
    session.endSession()
  }
}
// Get all authors
export const getAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, bookInfo = "title" } = req.query

    // Split the bookInfo string into an array and remove any empty strings
    const bookFields = bookInfo.split("+").filter((field) => field.trim() !== "")

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { lastName: 1, firstName: 1 }, // Sort by last name, then first name
      populate: {
        path: "books",
        select: bookFields.join(" "), // Select only the specified book fields
      },
      lean: true,
    }

    const result = await Author.paginate({}, options)

    logger.info(
      `Fetched ${result.docs.length} authors (page ${result.page} of ${result.totalPages})`
    )
    res.status(200).json({
      authors: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalAuthors: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching authors: ${error.message}`)
    next(createError("An error occurred while fetching authors", 500))
  }
}

// Get author's basic information
export const getAuthorInfo = async (req, res, next) => {
  try {
    const { identifier } = req.params

    let author
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      author = await Author.findById(identifier).select("-books")
    } else {
      author = await Author.findOne({ slug: identifier }).select("-books")
    }

    if (!author) {
      return next(createError("Author not found", 404))
    }

    logger.info(`Author info fetched: ${author._id}`)
    res.json(author)
  } catch (error) {
    logger.error(`Error fetching author info: ${error.message}`)
    next(createError("An error occurred while fetching the author info", 500))
  }
}

// Get author's books with pagination
export const getAuthorBooks = async (req, res, next) => {
  try {
    const { identifier } = req.params
    const { page = 1, limit = 10 } = req.query

    let author
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      author = await Author.findById(identifier).select("books")
    } else {
      author = await Author.findOne({ slug: identifier }).select("books")
    }

    if (!author) {
      return next(createError("Author not found", 404))
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { title: 1 },
    }

    const booksResult = await Book.paginate({ _id: { $in: author.books } }, options)

    logger.info(
      `Author books fetched: ${author._id}, Books page ${booksResult.page} of ${booksResult.totalPages}`
    )
    res.json({
      books: booksResult.docs,
      currentPage: booksResult.page,
      totalPages: booksResult.totalPages,
      totalBooks: booksResult.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching author books: ${error.message}`)
    next(createError("An error occurred while fetching the author's books", 500))
  }
}

// Update an author
export const updateAuthor = async (req, res, next) => {
  const { authorId } = req.params
  const { firstName, lastName, birthDate, deathDate, bio } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let updates = { firstName, lastName, birthDate, deathDate, bio }

    // Check if first name or last name is being updated
    if (firstName || lastName) {
      const existingAuthor = await Author.findById(authorId)
      if (!existingAuthor) {
        return next(createError("Author not found", 404))
      }
      const newFirstName = firstName || existingAuthor.firstName
      const newLastName = lastName || existingAuthor.lastName

      // Generate a new slug if first name or last name is changed
      const slugBase = slugify(`${newFirstName}-${newLastName}`, { lower: true, strict: true })
      const timestamp = Date.now()
      updates.slug = `${slugBase}-${timestamp}`
    }

    const updatedAuthor = await Author.findByIdAndUpdate(authorId, updates, {
      new: true,
      session,
      runValidators: true,
    })

    if (!updatedAuthor) {
      return next(createError("Author not found", 404))
    }

    await session.commitTransaction()
    logger.info(`Author updated: ${updatedAuthor._id}`)
    res.status(200).json(updatedAuthor)
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error updating author: ${error.message}`)
    next(error.status ? error : createError(error.message, 500))
  } finally {
    session.endSession()
  }
}

// Delete an author
export const deleteAuthor = async (req, res, next) => {
  const { authorId } = req.params
  const { fallbackAuthorId } = req.query
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    if (authorId === fallbackAuthorId) {
      return next(
        createError("Fallback author cannot be the same as the author to be deleted", 400)
      )
    }

    const [deletedAuthor, fallbackAuthor] = await Promise.all([
      Author.findByIdAndDelete(authorId).session(session),
      fallbackAuthorId ? Author.findById(fallbackAuthorId) : null,
    ])

    if (!deletedAuthor) {
      return next(createError("Author to be deleted not found", 404))
    }

    if (fallbackAuthorId && !fallbackAuthor) {
      return next(createError("Fallback author not found", 404))
    }

    // Find all books associated with the deleted author
    const booksToUpdate = await Book.find({ authors: authorId }).session(session)

    let modifiedCount = 0

    // Update each book individually
    for (const book of booksToUpdate) {
      book.authors = book.authors.filter((author) => author.toString() !== authorId)
      if (fallbackAuthorId && !book.authors.includes(fallbackAuthorId)) {
        book.authors.push(fallbackAuthorId)
      }
      await book.save({ session })
      modifiedCount++
    }

    await session.commitTransaction()
    logger.info(
      `Author deleted: ${deletedAuthor._id}, ${fallbackAuthorId ? `replaced with fallback author ${fallbackAuthorId}` : "removed"} in ${modifiedCount} books`
    )
    res.status(200).json({
      message: `Author successfully deleted and ${fallbackAuthorId ? "replaced with fallback author" : "removed from associated books"}`,
      modifiedBooks: modifiedCount,
    })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error deleting author: ${error.message}`)
    next(createError("An error occurred while deleting the author", 500))
  } finally {
    session.endSession()
  }
}
