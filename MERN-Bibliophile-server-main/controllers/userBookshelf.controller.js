// Version : express-async-errors
import mongoose from "mongoose"
import UserBookshelfItem from "../models/userBookshelfItem.model.js"
import User from "../models/user.model.js"
import Book from "../models/book.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"
import { getSortStage } from "../utils/sortUtils.js"

// Add a new book to the user's bookshelf item
export const addUserBookshelfItem = async (req, res, next) => {
  // const { userId } = req.params
  const userId = req.params.userId || req.user.id
  const { bookId, rating, readStatus, startReadDate, endReadDate, isFavorite, dueDate } = req.body

  try {
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return next(createError("User not found", 404))
    }

    // Check if the book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return next(createError("Book not found", 404))
    }

    // Check if the book is already in the user's bookshelf
    const existingItem = await UserBookshelfItem.findOne({ user: userId, book: bookId })
    if (existingItem) {
      return next(createError("This book is already in the user's bookshelf", 409))
    }

    // Create a new bookshelf item
    const newBookshelfItem = new UserBookshelfItem({
      user: userId,
      book: bookId,
      rating,
      readStatus,
      startReadDate,
      endReadDate,
      isFavorite,
      dueDate,
    })

    // Save the new bookshelf item
    const savedItem = await newBookshelfItem.save()

    // Add the item to the user's bookshelf array
    await User.findByIdAndUpdate(userId, { $push: { bookshelf: savedItem._id } })

    logger.info(`Book added to user's bookshelf: User ID ${userId}, Book ID ${bookId}`)
    res.status(201).json(savedItem)
  } catch (error) {
    logger.error(`Error adding book to user's bookshelf: ${error.message}`)
    if (error.name === "MongoServerError" && error.code === 11000) {
      // This handles the case where the unique compound index is violated
      return next(createError("This book is already in the user's bookshelf", 409))
    }
    next(createError(error.message, 500))
  }
}

// Get all bookshelf items for a specific user
export const getUserBookshelfItems = async (req, res, next) => {
  // const { userId } = req.params
  const userId = req.params.userId || req.user.id
  const { page = 1, limit = 10 } = req.query

  try {
    const aggregation = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $lookup: {
          from: "authors",
          localField: "bookDetails.authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by creation date, newest first
    ]

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    }

    const result = await UserBookshelfItem.aggregatePaginate(
      UserBookshelfItem.aggregate(aggregation),
      options
    )

    logger.info(
      `Retrieved ${result.docs.length} bookshelf items for user ID: ${userId} (page ${result.page} of ${result.totalPages})`
    )
    res.status(200).json({
      items: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching bookshelf items for user ID: ${userId}: ${error.message}`)
    next(createError("An error occurred while fetching bookshelf items", 500))
  }
}

// Get a single bookshelf item for a specific user by ID or slug
export const getUserBookshelfItem = async (req, res, next) => {
  // const { userId, identifier } = req.params
  const userId = req.params.userId || req.user.id

  try {
    const aggregation = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $lookup: {
          from: "authors",
          localField: "bookDetails.authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
    ]

    // Add condition to match either by _id or by book slug
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      aggregation[0].$match._id = new mongoose.Types.ObjectId(identifier)
    } else {
      // We need to match the slug after the $lookup stage
      aggregation.push({
        $match: {
          "bookDetails.slug": identifier,
        },
      })
    }

    const result = await UserBookshelfItem.aggregate(aggregation)

    if (result.length === 0) {
      logger.warn(`Bookshelf item not found, identifier: ${identifier}, user ID: ${userId}`)
      return next(createError("Bookshelf item not found", 404))
    }

    const bookshelfItem = result[0]

    logger.info(`Retrieved single bookshelf item, ID: ${bookshelfItem._id} for user ID: ${userId}`)
    res.status(200).json(bookshelfItem)
  } catch (error) {
    logger.error(`Error fetching single bookshelf item: ${error.message}`)
    next(createError("An error occurred while fetching the bookshelf item", 500))
  }
}

// Update a specific bookshelf item for a user
export const updateUserBookshelfItem = async (req, res, next) => {
  // const { userId, itemId } = req.params
  const userId = req.params.userId || req.user.id
  const itemId = req.params.itemId
  const updates = req.body

  const updatedItem = await UserBookshelfItem.findOneAndUpdate(
    { _id: itemId, user: userId },
    updates,
    {
      new: true,
    }
  )

  if (!updatedItem) {
    logger.warn(`Bookshelf item not found or does not belong to the user, ID: ${itemId}`)
    return next(createError("Bookshelf item not found or does not belong to the user", 404))
  }

  logger.info(`Updated bookshelf item, ID: ${updatedItem._id} for user ID: ${userId}`)
  res.status(200).json(updatedItem)
}

// Delete a specific bookshelf item for a user
export const deleteUserBookshelfItem = async (req, res, next) => {
  // const { userId } = req.params
  const userId = req.params.userId || req.user.id
  const { itemId } = req.params

  const deletedItem = await UserBookshelfItem.findOneAndDelete({ _id: itemId, user: userId })

  if (!deletedItem) {
    logger.warn(`Bookshelf item not found for deletion, entry ID: ${itemId}`)
    return next(createError("Bookshelf item not found for deletion", 404))
  }

  logger.info(`Deleted bookshelf item, entry ID: ${itemId} for user ID: ${userId}`)
  res.status(200).json({ message: "Bookshelf item deleted" })
}

// Delete all bookshelf items for a user
export const deleteAllUserBookshelfItems = async (req, res, next) => {
  // const { userId } = req.params
  const userId = req.params.userId || req.user.id

  const result = await UserBookshelfItem.deleteMany({ user: userId })

  if (result.deletedCount === 0) {
    logger.warn(`No bookshelf items found for deletion for user ID: ${userId}`)
    return next(createError("No bookshelf items found for deletion", 404))
  }

  logger.info(`Deleted ${result.deletedCount} bookshelf items for user ID: ${userId}`)
  res.status(200).json({ message: "All bookshelf items deleted" })
}

// Get the reading dashboard for a user
export const getUserReadingDashboard = async (req, res, next) => {
  const userId = req.params.userId || req.user.id
  const { page = 1, limit = 10 } = req.query

  try {
    const aggregation = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $lookup: {
          from: "authors",
          localField: "bookDetails.authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // Add default sorting by reading status
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$readStatus", "reading"] }, then: 1 },
                { case: { $eq: ["$readStatus", "to-read"] }, then: 2 },
                { case: { $eq: ["$readStatus", "read"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      {
        $sort: {
          "sortOrder": 1,
          "bookDetails.title": 1,
        },
      },
    ]

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    }

    const result = await UserBookshelfItem.aggregatePaginate(
      UserBookshelfItem.aggregate(aggregation),
      options
    )

    logger.info(
      `Retrieved ${result.docs.length} reading dashboard items for user ID: ${userId} (page ${result.page} of ${result.totalPages})`
    )
    res.status(200).json({
      items: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching reading dashboard for user ID: ${userId}: ${error.message}`)
    next(createError("An error occurred while fetching the reading dashboard", 500))
  }
}
