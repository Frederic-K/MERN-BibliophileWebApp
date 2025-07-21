import logger from "../utils/logger.js" 

function errorHandler(err, req, res, next) {
  // Log the error using the logger
  logger.error(`Error: ${err.message}`, { stack: err.stack })

  // Check if the response has already been sent to the client. If so, continue to error handler.
  if (res.headersSent) {
    return next(err)
  }

  // Set a default status code if not already set
  const statusCode = err.status || 500

  // Send a user-friendly error message
  res.status(statusCode).send({
    error: {
      message: err.message || "An unexpected error occurred. Please try again later.",
    },
  })
}

export default errorHandler
