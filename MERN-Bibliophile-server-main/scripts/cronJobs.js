import mongoose from "mongoose"
import config from "../config/config.js"
import logger from "../utils/logger.js"
import cron from "node-cron"
import { cleanupExpiredTokens } from "./cleanupExpiredTokens.js"

export const setupCronJobs = () => {
  const jobs = [
    {
      name: "Token Cleanup",
      enabled: config.tokenCleanup.enabled,
      schedule: config.tokenCleanup.cronSchedule,
      task: async () => {
        logger.info("Running scheduled cleanup of expired tokens")
        try {
          if (mongoose.connection.readyState !== 1) {
            logger.info("Establishing MongoDB connection for cleanup job")
            await mongoose.connect(config.db)
          }
          await cleanupExpiredTokens()
          logger.info("Token cleanup completed successfully")
        } catch (error) {
          logger.error(`Error during token cleanup: ${error.message}`)
        }
      },
    },
    // Add more jobs here
  ]

  jobs.forEach((job) => {
    if (job.enabled) {
      cron.schedule(job.schedule, async () => {
        logger.info(`Starting job: ${job.name}`)
        try {
          await job.task()
          logger.info(`Job completed: ${job.name}`)
        } catch (error) {
          logger.error(`Error in job ${job.name}: ${error.message}`)
        }
      })
      logger.info(`Job scheduled: ${job.name} (${job.schedule})`)
    } else {
      logger.info(`Job disabled: ${job.name}`)
    }
  })
}
