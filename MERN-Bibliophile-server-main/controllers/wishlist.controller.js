// Version : express-async-errors
import mongoose from "mongoose"
import User from "../models/user.model.js"
import Wishlist from "../models/wishlist.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"
import { sendWishlistByEmail, sendWishlistSentNotification } from "../utils/mailer.js"

// Create new wishlist books
export const createWishlistBooks = async (req, res, next) => {
  const { userId } = req.params
  const { books } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const wishlistBooks = books.map((book) => ({
      title: book.title,
      author: book.author,
      priority: book.priority,
      user: userId,
    }))

    const createdBooks = await Wishlist.insertMany(wishlistBooks, { session })

    await session.commitTransaction()
    logger.info(`${createdBooks.length} wishlist books created for user ID: ${userId}`)
    res.status(201).json(createdBooks)
  } catch (error) {
    await session.abortTransaction()
    if (error.name === "ValidationError") {
      logger.error(`Validation error creating wishlist books: ${error.message}`)
      next(createError("Invalid wishlist book data", 400))
    } else {
      logger.error(`Error creating wishlist books: ${error.message}`)
      next(createError("An error occurred while creating wishlist books", 500))
    }
  } finally {
    session.endSession()
  }
}

// Get all wishlist books for the authenticated user with pagination
export const getWishlistBooks = async (req, res, next) => {
  const { userId } = req.params

  try {
    const { page = 1, limit = 10 } = req.query

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Sort by creation date, newest first
    }

    const result = await Wishlist.paginate({ user: userId }, options)

    logger.info(
      `Retrieved ${result.docs.length} wishlist books for user ID: ${userId} (page ${result.page} of ${result.totalPages})`
    )
    res.status(200).json({
      wishlistBooks: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalBooks: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching wishlist books: ${error.message}`)
    next(createError("An error occurred while fetching wishlist books", 500))
  }
}

// Update a wishlist book
export const updateWishlistBook = async (req, res, next) => {
  const { userId, wishlistBookId } = req.params
  const updates = req.body

  const updatedBook = await Wishlist.findOneAndUpdate(
    { _id: wishlistBookId, user: userId },
    updates,
    { new: true }
  )

  if (!updatedBook) {
    logger.warn(`Wishlist book not found for update, ID: ${wishlistBookId}`)
    return next(createError("Book not found", 404))
  }

  logger.info(`Wishlist book updated, ID: ${wishlistBookId}`)
  res.status(200).json(updatedBook)
}

// Update multiple wishlist books
export const updateWishlistBooks = async (req, res, next) => {
  const { userId } = req.params
  const { books } = req.body

  logger.info(`Updating wishlist for user ID: ${userId} with: ${JSON.stringify(books)}`)

  try {
    // Start a session for the transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // 1. Get all existing wishlist book IDs for this user
      const existingBookIds = await Wishlist.find({ user: userId }).distinct("_id")

      // Handle case where books array is empty (clear wishlist)
      if (books.length === 0) {
        await Wishlist.deleteMany({ user: userId }, { session })
        await session.commitTransaction()
        logger.info(`All wishlist books deleted for user ID: ${userId}`)
        return res.status(200).json({
          message: "All wishlist books deleted successfully",
          deletedCount: existingBookIds.length,
        })
      }

      // 2. Prepare the upsert operations
      const operations = books.map((book) => ({
        updateOne: {
          filter: { _id: book._id || new mongoose.Types.ObjectId(), user: userId },
          update: {
            $set: {
              title: book.title,
              author: book.author,
              priority: book.priority,
              status: book.status || "pending", // Use default from schema
              user: userId,
            },
          },
          upsert: true,
        },
      }))

      // 3. Perform the bulk write operation
      const result = await Wishlist.bulkWrite(operations, { session })

      // 4. Calculate IDs to delete (existing IDs not in the new books list)
      const newBookIds = books.map((book) => book._id).filter(Boolean)
      const idsToDelete = existingBookIds.filter((id) => !newBookIds.includes(id.toString()))

      // 5. Delete books that are no longer in the list
      if (idsToDelete.length > 0) {
        await Wishlist.deleteMany({ _id: { $in: idsToDelete }, user: userId }, { session })
      }

      await session.commitTransaction()

      logger.info(
        `Wishlist updated for user ID: ${userId}. Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Deleted: ${idsToDelete.length}`
      )
      res.status(200).json({
        message: "Wishlist updated successfully",
        upsertedCount: result.upsertedCount,
        modifiedCount: result.modifiedCount,
        deletedCount: idsToDelete.length,
      })
    } catch (error) {
      await session.abortTransaction()
      logger.error(`Error updating wishlist: ${error.message}`)
      next(createError("An error occurred while updating the wishlist", 500))
    } finally {
      session.endSession()
    }
  } catch (error) {
    logger.error(`Error updating wishlist: ${error.message}`)
    next(createError("An error occurred while updating the wishlist", 500))
  }
}

// Delete wishlist books by IDs
export const deleteWishlistBooks = async (req, res, next) => {
  const { userId } = req.params
  const { bookIds } = req.body

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const deleteResult = await Wishlist.deleteMany(
      {
        _id: { $in: bookIds },
        user: userId,
      },
      { session }
    )

    if (deleteResult.deletedCount === 0) {
      await session.abortTransaction()
      logger.warn(`No wishlist books found for deletion, user ID: ${userId}`)
      return next(createError("No books found for deletion", 404))
    }

    await session.commitTransaction()
    logger.info(`${deleteResult.deletedCount} wishlist book(s) deleted for user ID: ${userId}`)
    res.status(200).json({
      message: "Books successfully deleted",
      deletedCount: deleteResult.deletedCount,
    })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error deleting wishlist books: ${error.message}`)
    next(createError("An error occurred while deleting wishlist books", 500))
  } finally {
    session.endSession()
  }
}

// Delete all wishlist books for a user
export const deleteAllWishlistBooks = async (req, res, next) => {
  const { userId } = req.params

  const result = await Wishlist.deleteMany({ user: userId })

  if (result.deletedCount === 0) {
    logger.warn(`No wishlist books found for deletion for user ID: ${userId}`)
    return next(createError("No wishlist books found for deletion", 404))
  }

  logger.info(`Deleted all wishlist books for user ID: ${userId}`)
  res.status(200).json({ message: "All wishlist books deleted" })
}

// Send wishlist
export const sendWishlistBooks = async (req, res, next) => {
  const { userId } = req.params
  const { email } = req.body // Use email from request body

  try {
    // Fetch the user's wishlist
    const wishlistBooks = await Wishlist.find({ user: userId })

    if (wishlistBooks.length === 0) {
      return res.status(404).json({ message: "No books found in the wishlist" })
    }

    // Fetch the user's information
    const user = await User.findById(userId)
    if (!user) {
      return next(createError("User not found", 404))
    }

    // Send wishlist email
    await sendWishlistByEmail(email, wishlistBooks, user.email, user.userName, next)

    // Send notification email to the user
    await sendWishlistSentNotification(user.email, email, next)

    logger.info(
      `Wishlist sent to ${email} and notification sent to ${user.email} for user ID: ${userId}`
    )
    res.status(200).json({ message: "Wishlist sent successfully and notification email sent" })
  } catch (error) {
    logger.error(`Error sending wishlist: ${error.message}`)
    next(createError("An error occurred while sending the wishlist", 500))
  }
}
