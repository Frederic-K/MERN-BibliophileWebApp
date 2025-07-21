import mongoose from "mongoose"
import Book from "../models/book.model.js"
import Author from "../models/author.model.js"
import UserBookshelfItem from "../models/userBookshelfItem.model.js"
import { v4 as uuidv4 } from "uuid"
import createError from "../utils/createError.js"
import admin from "firebase-admin"
import logger from "../utils/logger.js"
import slugify from "slugify"

// Create a new book
export const createBook = async (req, res, next) => {
  const {
    title,
    authors,
    summary,
    publishYear,
    coverBookImage,
    tags,
    format,
    availability,
    genre,
    pageCount,
    language,
  } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Generate a slug from the title
    const slugBase = slugify(title, { lower: true, strict: true })
    let slug = slugBase

    // Ensure the slug is unique
    while (await Book.findOne({ slug })) {
      const timestamp = Date.now()
      slug = `${slugBase}-${timestamp}`
    }

    const newBook = new Book({
      title,
      authors,
      summary,
      publishYear,
      coverBookImage,
      tags,
      format,
      availability,
      genre,
      pageCount,
      language,
      slug,
    })

    const savedBook = await newBook.save({ session })

    if (authors && authors.length > 0) {
      await Author.updateMany(
        { _id: { $in: authors } },
        { $addToSet: { books: savedBook._id } },
        { session }
      )
    }

    await session.commitTransaction()
    logger.info(`Book created: ${savedBook._id}`)
    res.status(201).json(savedBook)
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error creating book: ${error.message}`)
    next(createError(error.message, 500))
  } finally {
    session.endSession()
  }
}

// Get all books
export const getBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, authorInfo = "firstName+lastName" } = req.query

    // Split the authorInfo string into an array and remove any empty strings
    const authorFields = authorInfo.split("+").filter((field) => field.trim() !== "")

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: "authors",
        select: authorFields.join(" "), // Join the fields with a space for Mongoose select
      },
      lean: true,
    }

    const result = await Book.paginate({}, options)

    logger.info(`Fetched ${result.docs.length} books (page ${result.page} of ${result.totalPages})`)
    res.status(200).json({
      books: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalBooks: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching books: ${error.message}`)
    next(createError("An error occurred while fetching books", 500))
  }
}

// Get book info without authors
export const getBookInfo = async (req, res, next) => {
  try {
    const { identifier } = req.params

    let book
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      book = await Book.findById(identifier).select("-authors")
    } else {
      book = await Book.findOne({ slug: identifier }).select("-authors")
    }

    if (!book) {
      return next(createError("Book not found", 404))
    }

    logger.info(`Book info fetched: ${book._id}`)
    res.json(book)
  } catch (error) {
    logger.error(`Error fetching book info: ${error.message}`)
    next(createError("An error occurred while fetching the book info", 500))
  }
}

// Get book's authors with pagination
export const getBookAuthors = async (req, res, next) => {
  try {
    const { identifier } = req.params
    const { page = 1, limit = 10 } = req.query

    let book
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      book = await Book.findById(identifier).select("authors")
    } else {
      book = await Book.findOne({ slug: identifier }).select("authors")
    }

    if (!book) {
      return next(createError("Book not found", 404))
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { lastName: 1, firstName: 1 },
    }

    const authorsResult = await Author.paginate({ _id: { $in: book.authors } }, options)

    logger.info(
      `Book authors fetched: ${book._id}, Authors page ${authorsResult.page} of ${authorsResult.totalPages}`
    )
    res.json({
      authors: authorsResult.docs,
      currentPage: authorsResult.page,
      totalPages: authorsResult.totalPages,
      totalAuthors: authorsResult.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching book authors: ${error.message}`)
    next(createError("An error occurred while fetching the book's authors", 500))
  }
}

// // Update a book
// export const updateBook = async (req, res, next) => {
//   const { bookId } = req.params
//   const updates = req.body

//   const session = await mongoose.startSession()
//   session.startTransaction()

//   try {
//     const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
//       new: true,
//       session,
//       runValidators: true,
//     })

//     if (!updatedBook) {
//       return next(createError("Book not found", 404))
//     }

//     // If authors array is updated, update the corresponding authors
//     if (updates.authors) {
//       // Remove book from authors that are no longer associated
//       await Author.updateMany(
//         { _id: { $nin: updates.authors }, books: updatedBook._id },
//         { $pull: { books: updatedBook._id } },
//         { session }
//       )

//       // Add book to new authors
//       await Author.updateMany(
//         { _id: { $in: updates.authors } },
//         { $addToSet: { books: updatedBook._id } },
//         { session }
//       )
//     }

//     await session.commitTransaction()
//     logger.info(`Book updated: ${updatedBook._id}`)
//     res.status(200).json(updatedBook)
//   } catch (error) {
//     await session.abortTransaction()
//     logger.error(`Error updating book: ${error.message}`)
//     next(error.status ? error : createError(error.message, 500))
//   } finally {
//     session.endSession()
//   }
// }

// Update a book
// export const updateBook = async (req, res, next) => {
//   const { bookId } = req.params
//   const updates = req.body

//   const session = await mongoose.startSession()
//   session.startTransaction()

//   try {
//     // If the title is being updated, generate a new slug
//     if (updates.title) {
//       const slugBase = slugify(updates.title, { lower: true, strict: true })
//       let slug = slugBase

//       // Ensure the new slug is unique
//       while (await Book.findOne({ slug, _id: { $ne: bookId } })) {
//         const timestamp = Date.now()
//         slug = `${slugBase}-${timestamp}`
//       }

//       updates.slug = slug
//     }

//     const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
//       new: true,
//       session,
//       runValidators: true,
//     })

//     if (!updatedBook) {
//       return next(createError("Book not found", 404))
//     }

//     // If authors array is updated, update the corresponding authors
//     if (updates.authors) {
//       // Remove book from authors that are no longer associated
//       await Author.updateMany(
//         { _id: { $nin: updates.authors }, books: updatedBook._id },
//         { $pull: { books: updatedBook._id } },
//         { session }
//       )

//       // Add book to new authors
//       await Author.updateMany(
//         { _id: { $in: updates.authors } },
//         { $addToSet: { books: updatedBook._id } },
//         { session }
//       )
//     }

//     await session.commitTransaction()
//     logger.info(`Book updated: ${updatedBook._id}`)
//     res.status(200).json(updatedBook)
//   } catch (error) {
//     await session.abortTransaction()
//     logger.error(`Error updating book: ${error.message}`)
//     next(error.status ? error : createError(error.message, 500))
//   } finally {
//     session.endSession()
//   }
// }

// Update a book
export const updateBook = async (req, res, next) => {
  const { bookId } = req.params
  const updates = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // If the title is being updated, generate a new slug
    if (updates.title) {
      const slugBase = slugify(updates.title, { lower: true, strict: true })
      let slug = slugBase

      // Ensure the new slug is unique
      while (await Book.findOne({ slug, _id: { $ne: bookId } })) {
        const timestamp = Date.now()
        slug = `${slugBase}-${timestamp}`
      }

      updates.slug = slug
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
      session,
      runValidators: true,
    })

    if (!updatedBook) {
      return next(createError("Book not found", 404))
    }

    // If authors array is updated, update the corresponding authors
    if (updates.authors) {
      const bulkOps = [
        {
          updateMany: {
            filter: { _id: { $nin: updates.authors }, books: updatedBook._id },
            update: { $pull: { books: updatedBook._id } },
          },
        },
        {
          updateMany: {
            filter: { _id: { $in: updates.authors } },
            update: { $addToSet: { books: updatedBook._id } },
          },
        },
      ]

      await Author.bulkWrite(bulkOps, { session })
    }

    await session.commitTransaction()
    logger.info(`Book updated: ${updatedBook._id}`)
    res.status(200).json(updatedBook)
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error updating book: ${error.message}`)
    next(error.status ? error : createError(error.message, 500))
  } finally {
    session.endSession()
  }
}

// Upload a book cover image
export const uploadBookCover = async (req, res, next) => {
  if (!req.file) {
    logger.warn("No file uploaded for book cover")
    return next(createError("No file uploaded", 400))
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const book = await Book.findById(req.params.bookId).session(session)
    if (!book) {
      return next(createError("Book not found", 404))
    }

    // Delete old cover image if it exists
    if (book.coverBookImage) {
      try {
        const oldImagePath = book.coverBookImage.split("/o/")[1]?.split("?")[0]
        if (oldImagePath) {
          const oldImageFile = decodeURIComponent(oldImagePath)
          const oldBlob = admin.storage().bucket().file(oldImageFile)
          await oldBlob.delete()
          logger.info(`Old cover image deleted for book ID: ${book._id}`)
        }
      } catch (err) {
        logger.warn(`Failed to delete old cover image: ${err.message}. Continuing with upload.`)
      }
    }

    // Generate a unique filename using UUID
    const uniqueFileName = `${uuidv4()}-${req.file.originalname}`

    // Upload file to Firebase Storage
    const bucket = admin.storage().bucket()
    const blob = bucket.file(`coverBookImage/${uniqueFileName}`)
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    })

    await new Promise((resolve, reject) => {
      blobStream.on("error", reject)
      blobStream.on("finish", resolve)
      blobStream.end(req.file.buffer)
    })

    // Get the public URL using the correct Firebase Storage URL format
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`coverBookImage/${uniqueFileName}`)}?alt=media`

    // Save the file URL in the book's document
    book.coverBookImage = publicUrl
    await book.save({ session })

    await session.commitTransaction()

    logger.info(`Book cover uploaded: ${book._id}`)
    res.status(200).json({ message: "Book cover uploaded successfully", coverBookImage: publicUrl })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error in book cover upload: ${error.message}`)
    next(error)
  } finally {
    session.endSession()
  }
}

// // Delete a book
// export const deleteBook = async (req, res, next) => {
//   const { bookId } = req.params

//   const session = await mongoose.startSession()
//   session.startTransaction()

//   try {
//     const deletedBook = await Book.findById(bookId).session(session)

//     if (!deletedBook) {
//       await session.abortTransaction()
//       return next(createError("Book not found", 404))
//     }

//     // Delete cover image from Firebase Storage if it exists
//     if (deletedBook.coverBookImage) {
//       const imagePath = deletedBook.coverBookImage.split("/o/")[1]?.split("?")[0]
//       if (imagePath) {
//         const decodedImagePath = decodeURIComponent(imagePath)
//         const imageFile = admin.storage().bucket().file(decodedImagePath)

//         try {
//           await imageFile.delete()
//           logger.info(`Cover image deleted for book ID: ${bookId}`)
//         } catch (err) {
//           logger.warn(
//             `Failed to delete cover image: ${err.message}. Continuing with book deletion.`
//           )
//         }
//       }
//     }

//     // Delete the book from MongoDB
//     await Book.findByIdAndDelete(bookId).session(session)

//     // Remove book reference from all authors
//     await Author.updateMany({ books: bookId }, { $pull: { books: bookId } }, { session })

//     // Remove book from all user bookshelves
//     const bookshelfResult = await UserBookshelfItem.deleteMany({ book: bookId }).session(session)
//     logger.info(`Removed book from ${bookshelfResult.deletedCount} user bookshelf item(s)`)

//     await session.commitTransaction()
//     logger.info(`Book deleted: ${deletedBook._id} by user: ${req.user._id}`)
//     res.status(200).json({ message: "Book successfully deleted" })
//   } catch (error) {
//     await session.abortTransaction()
//     logger.error(`Error deleting book: ${error.message}`)
//     next(createError(error.message, 500))
//   } finally {
//     session.endSession()
//   }
// }

// Delete a book (bulk ops)
export const deleteBook = async (req, res, next) => {
  const { bookId } = req.params

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const deletedBook = await Book.findById(bookId).session(session)

    if (!deletedBook) {
      await session.abortTransaction()
      return next(createError("Book not found", 404))
    }

    // Delete cover image from Firebase Storage if it exists
    if (deletedBook.coverBookImage) {
      const imagePath = deletedBook.coverBookImage.split("/o/")[1]?.split("?")[0]
      if (imagePath) {
        const decodedImagePath = decodeURIComponent(imagePath)
        const imageFile = admin.storage().bucket().file(decodedImagePath)

        try {
          await imageFile.delete()
          logger.info(`Cover image deleted for book ID: ${bookId}`)
        } catch (err) {
          logger.warn(
            `Failed to delete cover image: ${err.message}. Continuing with book deletion.`
          )
        }
      }
    }

    // Prepare bulk operations
    const bulkOps = [
      {
        deleteOne: {
          filter: { _id: bookId },
        },
      },
      {
        updateMany: {
          filter: { books: bookId },
          update: { $pull: { books: bookId } },
        },
      },
      {
        deleteMany: {
          filter: { book: bookId },
        },
      },
    ]

    // Execute bulk operations
    const [bookDeletion, authorUpdate, bookshelfDeletion] = await Promise.all([
      Book.bulkWrite([bulkOps[0]], { session }),
      Author.bulkWrite([bulkOps[1]], { session }),
      UserBookshelfItem.bulkWrite([bulkOps[2]], { session }),
    ])

    await session.commitTransaction()

    logger.info(`Book deleted: ${deletedBook._id} by user: ${req.user._id}`)
    logger.info(`Removed book from ${bookshelfDeletion.deletedCount} user bookshelf item(s)`)
    logger.info(`Updated ${authorUpdate.modifiedCount} author(s)`)

    res.status(200).json({ message: "Book successfully deleted" })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error deleting book: ${error.message}`)
    next(createError(error.message, 500))
  } finally {
    session.endSession()
  }
}
