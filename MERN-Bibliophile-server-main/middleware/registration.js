import Registration from "../models/registration.model.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

const registration = async (req, res, next) => {
  logger.info("Checking registration status")

  const status = await Registration.findOne()

  if (!status) {
    logger.warn("Registration status not found in the database")
    return next(createError("Registration status not available.", 500))
  }

  if (!status.isOpen) {
    logger.info("Registration attempt when registrations are closed")
    return next(createError("Registrations are currently closed.", 403))
  }

  logger.info("Registration check passed, registrations are open")
  next()
}

export default registration
