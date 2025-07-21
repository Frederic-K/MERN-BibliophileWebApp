import multer from "multer"
import logger from "../utils/logger.js"

const createFileUpload = (allowedTypes, maxSizeMB) => {
  const storage = multer.memoryStorage()

  return multer({
    storage: storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 }, // Convert MB to bytes
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        logger.info(`File upload started: ${file.originalname}`) // Log file upload start
        cb(null, true)
      } else {
        const error = new Error(`Only ${allowedTypes.join(", ")} files are allowed!`)
        logger.error(`File upload error: ${error.message}`) // Log file upload error
        cb(error, false)
      }
    },
  })
}

export default createFileUpload
