import User from "../models/user.model.js"
import Wishlist from "../models/wishlist.model.js"
import UserBookshelf from "../models/userBookshelfItem.model.js"
import createError from "../utils/createError.js"
import { v4 as uuidv4 } from "uuid"
import logger from "../utils/logger.js"
import admin from "firebase-admin"

// Create a new user
export const createUser = async (req, res, next) => {
  const user = new User(req.body)
  await user.save()
  logger.info(`User created with ID: ${user._id}`)
  res.status(201).json(user)
}

// Get all users (admin dashboard)
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, userInfo = "userName+email+profileImage+role" } = req.query

    // Split the userInfo string into an array and remove any empty strings
    const userFields = userInfo.split("+").filter((field) => field.trim() !== "")

    // Create a projection object
    const projection = Object.fromEntries(userFields.map((field) => [field, 1]))

    // Ensure password is always excluded
    delete projection.password

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      select: projection,
      lean: true, // Use lean for better performance
    }

    const result = await User.paginate({}, options)

    logger.info(
      `Retrieved ${result.docs.length} users (page ${result.page} of ${result.totalPages})`
    )
    res.status(200).json({
      users: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalUsers: result.totalDocs,
    })
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`)
    next(createError("An error occurred while fetching users", 500))
  }
}

// Get a user by ID
export const getUserById = async (req, res, next) => {
  const userId = req.params.userId || req.user.id
  try {
    const user = await User.findById(userId)
      .select("-password") // Exclude password
      .populate({
        path: "bookshelf",
        populate: {
          path: "books",
          select: "title",
          populate: {
            path: "authors",
            select: "firstName lastName",
          },
        },
      })
      .populate({
        path: "wishlists",
        select: "title",
      })

    if (!user) {
      logger.warn(`User not found with ID: ${userId}`)
      return next(createError("User not found", 404))
    }

    logger.info(`Retrieved user with ID: ${user._id}`)
    res.status(200).json(user)
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`)
    next(createError("An error occurred while fetching the user", 500))
  }
}

// Update a user
export const updateUser = async (req, res, next) => {
  const userId = req.params.userId
  logger.info(`Attempting to update user with ID: ${userId}`)

  const { password, role, ...updates } = req.body

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password")

  if (!user) {
    logger.warn(`User not found for update with ID: ${userId}`)
    return next(createError("User not found", 404))
  }

  logger.info(`User updated successfully with ID: ${userId}`)
  // Could adjust the response to only include the updated fields needed from the client
  // for exemple: { _id, username, email, role, profileImage }
  res.status(200).json(userId)
}

export const uploadProfileImage = async (req, res, next) => {
  const userId = req.params.userId
  logger.info(`Attempting to upload profile image for user with ID: ${userId}`)

  if (!req.file) {
    logger.warn("No file uploaded for profile image")
    return next(createError("No file uploaded", 400))
  }

  const session = await User.startSession()
  session.startTransaction()

  try {
    const user = await User.findById(userId).session(session)
    if (!user) {
      return next(createError("User not found", 404))
    }

    // Delete old image if it exists
    if (user.profileImage) {
      try {
        const oldImagePath = user.profileImage.split("/o/")[1]?.split("?")[0]
        if (oldImagePath) {
          const oldImageFile = decodeURIComponent(oldImagePath)
          const oldBlob = admin.storage().bucket().file(oldImageFile)
          await oldBlob.delete()
          logger.info(`Old profile image deleted for user ID: ${userId}`)
        }
      } catch (err) {
        logger.warn(`Failed to delete old profile image: ${err.message}. Continuing with upload.`)
      }
    }

    // Generate a unique filename using UUID
    const uniqueFileName = `${uuidv4()}-${req.file.originalname}`

    // Upload file to Firebase Storage
    const bucket = admin.storage().bucket()
    const blob = bucket.file(`profileImages/${uniqueFileName}`)
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
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`profileImages/${uniqueFileName}`)}?alt=media`

    // Save the file URL in the user's document
    user.profileImage = publicUrl
    await user.save({ session })

    await session.commitTransaction()

    logger.info(`Profile image uploaded for user ID: ${userId}`)
    res
      .status(200)
      .json({ message: "Profile image uploaded successfully", profileImage: publicUrl })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error in profile image upload: ${error.message}`)
    next(error)
  } finally {
    session.endSession()
  }
}

// Delete a user
export const deleteUser = async (req, res, next) => {
  const userId = req.params.userId
  const session = await User.startSession()
  session.startTransaction()

  try {
    const user = await User.findById(userId).session(session)
    if (!user) {
      return next(createError("User not found", 404))
    }

    // Delete profile image from Firebase Storage if it exists
    if (user.profileImage) {
      const imagePath = user.profileImage.split("/o/")[1].split("?")[0]
      const decodedImagePath = decodeURIComponent(imagePath)
      const imageFile = admin.storage().bucket().file(decodedImagePath)

      try {
        await imageFile.delete()
        logger.info(`Profile image deleted for user ID: ${userId}`)
      } catch (err) {
        logger.warn(
          `Failed to delete profile image: ${err.message}. Continuing with user deletion.`
        )
      }
    }

    // Delete the user's wishlist items
    const wishlistResult = await Wishlist.deleteMany({ user: userId }).session(session)
    logger.info(`Deleted ${wishlistResult.deletedCount} wishlist items for user ID: ${userId}`)

    // Delete the user's bookshelf items
    const bookshelfResult = await UserBookshelf.deleteMany({ user: user._id }).session(session)
    logger.info(`Deleted ${bookshelfResult.deletedCount} bookshelf items for user ID: ${userId}`)

    // Delete the user from MongoDB
    await User.findByIdAndDelete(userId).session(session)

    await session.commitTransaction()
    logger.info(`User deleted with ID: ${userId}`)
    res.status(200).json({
      message: "User deleted successfully",
      deletedWishlistItems: wishlistResult.deletedCount,
      deletedBookshelfItems: bookshelfResult.deletedCount,
    })
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Error deleting user: ${error.message}`)
    next(error.status ? error : createError(error.message, 500))
  } finally {
    session.endSession()
  }
}
