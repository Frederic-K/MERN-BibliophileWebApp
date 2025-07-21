import jwt from "jsonwebtoken"
import config from "../config/config.js"
import User from "../models/user.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

async function checkAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token // Retrieve token from cookies
    if (!token) {
      logger.warn("Access attempt without token")
      return next(createError("Access denied.", 401))
    }

    let decoded
    try {
      decoded = jwt.verify(token, config.jwtPrivateKey)
    } catch (jwtError) {
      // Log the specific error for server-side debugging
      logger.warn(`JWT verification failed: ${jwtError.name} - ${jwtError.message}`)
      // Return a generic authentication error to the client
      return next(createError("Authentication failed. Please sign in again.", 401))
    }

    if (!decoded.userId) {
      logger.warn("Token does not contain userId")
      return next(createError("Authentication failed. Please sign in again.", 401))
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      logger.warn(`User not found for ID: ${decoded.userId}`)
      return next(createError("Authentication failed. Please sign in again.", 401))
    }

    if (!user.isAuthorized) {
      logger.warn(`Unauthorized access attempt by user ID: ${user._id}`)
      return next(createError("Access denied. User not authorized.", 403))
    }

    req.user = user // Attach the user to the request
    logger.info(`User ID: ${user._id} authenticated successfully`)
    next()
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`)
    next(createError("Authentication failed", 500))
  }
}

export default checkAuthenticated
