// TODO - Add logging to local if db connection fails
// import fs from "fs"
// import path from "path"

// // Ensure the logs directory exists
// const logDirectory = path.join(__dirname, "../logs")
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory)
// }

// Create a Winston logger

import config from "../config/config.js"
import { createLogger, format, transports } from "winston"
import "winston-mongodb"

// Create a Winston logger for logging errors, warnings, and info messages
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.MongoDB({
      db: config.db,
      collection: "logs",
      level: config.logLevel,
      capped: true,
      cappedMax: 2097152, // 2 MB
      // options: { useUnifiedTopology: true }, // Warning: useUnifiedTopology is a deprecated option
      expireAfterSeconds: 86400, // 1 day
      tryReconnect: true, // Attempt to reconnect if MongoDB is unavailable
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
})

// Asynchronous logging error handling
logger.on("error", (err) => {
  console.error("Logging error:", err)
})

export default logger
