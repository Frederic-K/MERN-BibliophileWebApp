import mongoose from "mongoose"
import Book from "../models/book.model.js"
import UserBookshelfItem from "../models/userBookshelfItem.model.js"
import Author from "../models/author.model.js"
import User from "../models/user.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

export const globalSearch = async (req, res, next) => {
  try {
    const {
      searchTerm = "",
      searchType,
      page = 1,
      limit = 10,
      sortBy = "title",
      sortOrder = "asc",
      format,
      minRating,
      readStatus,
      availabilityStatus,
      isFavorite,
      startDate,
      endDate,
      userInfo = "userName+email+profileImage+role",
      authorInfo = "firstName+lastName",
      bookInfo = "title",
    } = req.query

    const userId = req.params.userId || req.user._id

    if (!searchType) {
      return next(createError("Search type is required", 400))
    }

    const searchParams = {
      searchTerm,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      filters: {
        format,
        minRating,
        readStatus,
        availabilityStatus,
        isFavorite,
        startDate,
        endDate,
      },
      userId,
      userInfo,
      authorInfo,
      bookInfo,
    }

    let result

    switch (searchType) {
      case "books":
        result = await searchBooks(searchParams)
        break
      case "bookshelf":
        result = await searchBookshelf(searchParams)
        break
      case "authors":
        result = await searchAuthors(searchParams)
        break
      case "users":
        result = await searchUsers(searchParams)
        break
      default:
        return next(createError("Invalid search type", 400))
    }

    res.status(200).json(result)
  } catch (error) {
    logger.error(`Error in global search: ${error.message}`)
    next(createError("An error occurred while performing the search", 500))
  }
}

const searchBooks = async ({
  searchTerm,
  page,
  limit,
  sortBy,
  sortOrder,
  authorInfo = "firstName+lastName",
}) => {
  try {
    const authorFields = authorInfo.split("+").filter((field) => field.trim() !== "")

    const aggregation = [
      // Match based on search term (if provided)
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { title: { $regex: searchTerm, $options: "i" } },
                  {
                    authors: {
                      $in: await Author.find({
                        $or: [
                          { firstName: { $regex: searchTerm, $options: "i" } },
                          { lastName: { $regex: searchTerm, $options: "i" } },
                        ],
                      }).distinct("_id"),
                    },
                  },
                ],
              },
            },
          ]
        : []),

      // Lookup to populate authors with selected fields
      {
        $lookup: {
          from: "authors",
          localField: "authors",
          foreignField: "_id",
          as: "authors",
          pipeline: [{ $project: Object.fromEntries(authorFields.map((field) => [field, 1])) }],
        },
      },

      // Sort stage
      {
        $sort:
          sortBy === "author"
            ? {
                "authorDetails.lastName": sortOrder === "desc" ? -1 : 1,
                "authorDetails.firstName": sortOrder === "desc" ? -1 : 1,
              }
            : { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      },
    ]

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    }

    const result = await Book.aggregatePaginate(Book.aggregate(aggregation), options)

    logger.info(
      `${searchTerm ? `Searched for books with term: ${searchTerm},` : "Retrieved all books,"} found ${result.docs.length} results`
    )

    return {
      books: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalBooks: result.totalDocs,
    }
  } catch (error) {
    logger.error(`Error in searchBooks: ${error.message}`)
    throw createError("An error occurred while searching for books", 500)
  }
}

const searchBookshelf = async ({ searchTerm, page, limit, sortBy, sortOrder, userId, filters }) => {
  try {
    const aggregation = [
      // Match user's bookshelf items
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // Lookup to get book details
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },

      // Converts the bookDetails array to a single object
      { $unwind: "$bookDetails" },

      // Lookup to get author details
      {
        $lookup: {
          from: "authors",
          localField: "bookDetails.authors",
          foreignField: "_id",
          as: "authorDetails",
        },
      },

      // Match based on search term (if provided)
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { "bookDetails.title": { $regex: searchTerm, $options: "i" } },
                  { "authorDetails.firstName": { $regex: searchTerm, $options: "i" } },
                  { "authorDetails.lastName": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      // Apply filters
      {
        $match: {
          ...(filters.readStatus && filters.readStatus !== "All"
            ? { readStatus: filters.readStatus }
            : {}),
          ...(filters.minRating && filters.minRating !== "All"
            ? { rating: { $gte: parseInt(filters.minRating) } }
            : {}),
          ...(filters.isFavorite && filters.isFavorite !== "All"
            ? { isFavorite: filters.isFavorite === "true" }
            : {}),
          ...(filters.format && filters.format !== "All"
            ? { "bookDetails.format": filters.format }
            : {}),
          ...(filters.availabilityStatus && filters.availabilityStatus !== "All"
            ? { "bookDetails.availability": filters.availabilityStatus }
            : {}),
          ...(filters.startDate ? { startReadDate: { $gte: new Date(filters.startDate) } } : {}),
          ...(filters.endDate ? { endReadDate: { $lte: new Date(filters.endDate) } } : {}),
        },
      },

      // Sort stage
      {
        $sort: (() => {
          switch (sortBy) {
            case "title":
              return { "bookDetails.title": sortOrder === "desc" ? -1 : 1 }
            case "author":
              return {
                "authorDetails.lastName": sortOrder === "desc" ? -1 : 1,
                "authorDetails.firstName": sortOrder === "desc" ? -1 : 1,
              }
            case "rating":
              return { rating: sortOrder === "desc" ? -1 : 1 }
            case "readStatus":
              return { readStatus: sortOrder === "desc" ? -1 : 1 }
            case "startDate":
              return { startReadDate: sortOrder === "desc" ? -1 : 1 }
            case "endDate":
              return { endReadDate: sortOrder === "desc" ? -1 : 1 }
            default:
              return { "bookDetails.title": 1 }
          }
        })(),
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

    logger.info(`Searched bookshelf with term: ${searchTerm}, found ${result.docs.length} results`)

    return {
      items: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalDocs,
    }
  } catch (error) {
    logger.error(`Error in searchBookshelf: ${error.message}`)
    throw createError("An error occurred while searching the bookshelf", 500)
  }
}

const searchAuthors = async ({
  searchTerm,
  page,
  limit,
  sortBy,
  sortOrder,
  bookInfo = "title",
}) => {
  try {
    const bookFields = bookInfo.split("+").filter((field) => field.trim() !== "")

    const aggregation = [
      // Match based on search term
      {
        $match: {
          $or: [
            { firstName: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
      // Lookup to get book details with selected fields
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "books",
          pipeline: [{ $project: Object.fromEntries(bookFields.map((field) => [field, 1])) }],
        },
      },
      // Sort stage
      {
        $sort:
          sortBy === "firstName"
            ? { firstName: sortOrder === "desc" ? -1 : 1, lastName: sortOrder === "desc" ? -1 : 1 }
            : { lastName: sortOrder === "desc" ? -1 : 1, firstName: sortOrder === "desc" ? -1 : 1 },
      },
    ]

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    }

    const result = await Author.aggregatePaginate(Author.aggregate(aggregation), options)

    logger.info(
      `Searched for authors with term: ${searchTerm}, found ${result.docs.length} results`
    )

    return {
      authors: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalAuthors: result.totalDocs,
    }
  } catch (error) {
    logger.error(`Error in searchAuthors: ${error.message}`)
    throw createError("An error occurred while searching for authors", 500)
  }
}

const searchUsers = async ({
  searchTerm,
  page,
  limit,
  sortBy,
  sortOrder,
  userInfo = "userName+email+profileImage+role",
}) => {
  try {
    const userFields = userInfo.split("+").filter((field) => field.trim() !== "")

    // Create a projection object
    const projection = Object.fromEntries(userFields.map((field) => [field, 1]))

    // Ensure password is always excluded
    delete projection.password

    const aggregation = [
      // Match based on search term
      {
        $match: {
          $or: [
            { userName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
      // Project stage to select only the specified fields
      {
        $project: projection,
      },
      // Sort stage
      {
        $sort:
          sortBy === "email"
            ? { email: sortOrder === "desc" ? -1 : 1 }
            : { userName: sortOrder === "desc" ? -1 : 1 },
      },
    ]

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    }

    const result = await User.aggregatePaginate(User.aggregate(aggregation), options)

    logger.info(`Searched for users with term: ${searchTerm}, found ${result.docs.length} results`)

    return {
      users: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalUsers: result.totalDocs,
    }
  } catch (error) {
    logger.error(`Error in searchUsers: ${error.message}`)
    throw createError("An error occurred while searching for users", 500)
  }
}
