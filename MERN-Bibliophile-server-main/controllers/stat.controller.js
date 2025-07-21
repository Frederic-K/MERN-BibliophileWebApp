import mongoose from "mongoose"
import Book from "../models/book.model.js"
import Author from "../models/author.model.js"
import UserBookshelfItem from "../models/userBookshelfItem.model.js"
import logger from "../utils/logger.js"
import createError from "../utils/createError.js"

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    logger.info(`Fetching stats for user: ${userId}`)

    // Total counts
    const totalBooks = await Book.countDocuments()
    const totalAuthors = await Author.countDocuments()
    const totalUserBookshelfItems = await UserBookshelfItem.countDocuments({ user: userId })

    // Last month's new items
    const lastMonthNewItems = await UserBookshelfItem.countDocuments({
      user: userId,
      createdAt: { $gte: lastMonth },
    })

    // Read items
    const readItems = await UserBookshelfItem.countDocuments({
      user: userId,
      readStatus: "read",
    })

    // Last month's read items
    const lastMonthReadItems = await UserBookshelfItem.countDocuments({
      user: userId,
      readStatus: "read",
      endReadDate: { $gte: lastMonth },
    })

    // Unread items
    const unreadItems = await UserBookshelfItem.countDocuments({
      user: userId,
      readStatus: { $ne: "read" },
    })

    // Favorite items
    const favoriteItems = await UserBookshelfItem.countDocuments({
      user: userId,
      isFavorite: true,
    })

    // Items with rating >= 4
    const highRatedItems = await UserBookshelfItem.countDocuments({
      user: userId,
      rating: { $gte: 4 },
    })

    // Simplified aggregation for pages read
    const pagesReadAggregation = await UserBookshelfItem.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          readStatus: "read",
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
        $group: {
          _id: null,
          totalPagesRead: { $sum: { $ifNull: ["$bookDetails.pageCount", 0] } },
          lastMonthPagesRead: {
            $sum: {
              $cond: [
                { $gte: [{ $ifNull: ["$endReadDate", new Date(0)] }, lastMonth] },
                { $ifNull: ["$bookDetails.pageCount", 0] },
                0,
              ],
            },
          },
        },
      },
    ])

    const { totalPagesRead = 0, lastMonthPagesRead = 0 } = pagesReadAggregation[0] || {}

    const stats = {
      totalBooks,
      totalAuthors,
      totalUserBookshelfItems,
      lastMonthNewItems,
      readItems,
      lastMonthReadItems,
      unreadItems,
      favoriteItems,
      highRatedItems,
      totalPagesRead,
      lastMonthPagesRead,
    }

    logger.info(`Stats calculated for user ${userId}:`, stats)
    res.status(200).json(stats)
  } catch (error) {
    logger.error(`Error fetching user statistics for user ${req.user.id}:`, error)
    next(createError(500, "Error fetching user statistics"))
  }
}
