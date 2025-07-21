import { defineAbilityFor } from "../utils/ability.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

const checkPermission = (action, subject) => (req, res, next) => {
  try {
    if (!req.user) {
      logger.error("User not authenticated")
      return next(createError("User not authenticated", 401))
    }

    const ability = defineAbilityFor(req.user)

    if (ability.can(action, subject)) {
      logger.info(`Permission granted for ${req.user.role} to ${action} on ${subject}`)
      next()
    } else {
      logger.warn(`Permission denied for ${req.user.role} to ${action} on ${subject}`)
      next(createError("Permission denied", 403))
    }
  } catch (error) {
    logger.error(`Error in permission check: ${error.message}`)
    next(createError("Error checking permissions", 500))
  }
}

export default checkPermission
