// Third-party modules
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"

// Local modules
import "express-async-errors"
import "./config/firebaseAdmin.js"
import logger from "./utils/logger.js"
import config from "./config/config.js"
import errorHandler from "./middleware/error.js"
import { setupCronJobs } from "./scripts/cronJobs.js"
import { gracefulShutdown } from "./utils/gracefulShutdown.js"

// Route imports
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import bookRoutes from "./routes/book.route.js"
import authorRoutes from "./routes/author.route.js"
import userBookshelfRoutes from "./routes/userBookshelf.route.js"
import wishlistRoutes from "./routes/wishlist.route.js"
import registrationRoutes from "./routes/registration.route.js"
import searchRoutes from "./routes/search.route.js"
// import healthCheckRoutes from "./routes/healthCheck.route.js"
import statRoutes from "./routes/stat.route.js"

// Handle uncaught exceptions and rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", reason)
  gracefulShutdown(null, "UNHANDLED_REJECTION")
})
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err)
  gracefulShutdown(null, "UNCAUGHT_EXCEPTION")
})

// Configuration
const PORT = config.port
const app = express()

// Add this line to trust the proxy
app.set("trust proxy", 1)

// Logging
logger.info(`Server configured to run on port ${PORT}`)

// Rate limiting configuration
const apiLimiter = rateLimit({
  // This configuration is set to handle bursts of activity typical in a my app.
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // Limit each IP to 300 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    // Log the rate limit event
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)

    // Respond with the default message and status (typically, 429)
    res.status(options.statusCode).send(options.message)
  },
  keyGenerator: (req) => {
    return req.ip // Use the IP from X-Forwarded-For when behind a proxy
  },
})

// CORS configuration
const corsOptions = {
  // CORS configuration to handle multiple origins if needed
  origin: Array.isArray(config.corsOrigin) ? config.corsOrigin : [config.corsOrigin],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600,
}

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  })
)
app.use(mongoSanitize())
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// Apply rate limiting to API routes
app.use("/api", apiLimiter)

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" })
  logger.info("Health check request received")
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/authors", authorRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/bookshelves", userBookshelfRoutes)
app.use("/api/wishlists", wishlistRoutes)
app.use("/api/registration", registrationRoutes)
app.use("/api/search", searchRoutes)
// app.use("/health", healthCheckRoutes)
app.use("/api/stats", statRoutes)

// Use centralized error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    const dbUri = config.db
    await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000,
    })
    logger.info("MongoDB is connected 👍")

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is running on port ${PORT} 🚀`)
    })

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"))
  } catch (err) {
    logger.error("Failed to start server:", err)
    process.exit(1)
  }
}

const initializeApp = async () => {
  await startServer()
  await setupCronJobs()
  logger.info("Server and cron jobs initialized successfully")
}

initializeApp().catch((err) => {
  logger.error("Failed to initialize application:", err)
  process.exit(1)
})
