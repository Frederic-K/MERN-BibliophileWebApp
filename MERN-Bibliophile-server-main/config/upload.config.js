import createFileUpload from "../middleware/fileUpload.js"

// Configure middleware for image uploads
export const imageUpload = createFileUpload(["image/jpeg", "image/png", "image/webp"], 1)
