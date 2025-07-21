import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

const validate = (schemas) => (req, res, next) => {
  try {
    logger.info(`Validating request for ${req.method} ${req.originalUrl}`)

    if (schemas.params) {
      const { error } = schemas.params.validate(req.params)
      if (error) {
        logger.warn(
          `Validation failed for params: ${error.details.map((detail) => detail.message).join(", ")}`
        )
        return next(createError(error.details.map((detail) => detail.message).join(", "), 400))
      }
    }
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body)
      if (error) {
        logger.warn(
          `Validation failed for body: ${error.details.map((detail) => detail.message).join(", ")}`
        )
        return next(createError(error.details.map((detail) => detail.message).join(", "), 400))
      }
    }
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query)
      if (error) {
        logger.warn(
          `Validation failed for query: ${error.details.map((detail) => detail.message).join(", ")}`
        )
        return next(createError(error.details.map((detail) => detail.message).join(", "), 400))
      }
    }

    logger.info(`Validation passed for ${req.method} ${req.originalUrl}`)
    next()
  } catch (err) {
    logger.error(`Unexpected error during validation: ${err.message}`)
    next(err)
  }
}

export default validate
