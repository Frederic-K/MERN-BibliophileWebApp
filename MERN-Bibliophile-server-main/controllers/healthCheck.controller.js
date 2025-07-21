// Health check
import mongoose from "mongoose"
import admin from "firebase-admin"
import logger from "../utils/logger.js"

export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected"

    // Check Firebase connection:
    const firebaseStatus = admin.apps.length ? "connected" : "disconnected"

    const healthStatus = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      firebase: firebaseStatus,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    }

    res.status(200).json(healthStatus)
    logger.info("Health check request received", healthStatus)
  } catch (error) {
    logger.error("Health check failed", error)
    res.status(500).json({ status: "ERROR", message: error.message })
  }
}
