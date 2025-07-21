import logger from "./logger.js"
import mongoose from "mongoose"

export const gracefulShutdown = (server, signal, timeout = 10000) => {
  logger.info(`${signal} signal received: initiating graceful shutdown`)

  const forceExit = () => {
    logger.error("Graceful shutdown timed out. Forcing exit.")
    process.exit(1)
  }

  const shutdownTimeout = setTimeout(forceExit, timeout)

  const closeMongoConnection = async () => {
    if (mongoose.connection.readyState === 1) {
      // 1 = connected
      try {
        await mongoose.connection.close(false)
        logger.info("MongoDB connection closed")
      } catch (error) {
        logger.error("Error closing MongoDB connection:", error)
      }
    } else {
      logger.info("MongoDB not connected, skipping disconnect")
    }
    clearTimeout(shutdownTimeout)
    process.exit(0)
  }

  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error("Error closing HTTP server:", err)
        forceExit()
      } else {
        logger.info("HTTP server closed")
        await closeMongoConnection()
      }
    })
  } else {
    logger.info("HTTP server not initialized, closing database connection")
    closeMongoConnection()
  }
}
