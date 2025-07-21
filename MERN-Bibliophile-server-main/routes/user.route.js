import express from "express"
import { userIdSchema, createUserSchema, updateUserSchema } from "../validations/user.validation.js"
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
} from "../controllers/user.controller.js"
import { imageUpload } from "../config/upload.config.js"
import validate from "../middleware/validation.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Route to create a new user (admin only)
router.post(
  "/",
  checkAuthenticated,
  checkPermission(ACTIONS.CREATE, RESOURCES.USER),
  validate({ body: createUserSchema }),
  createUser
)

// Route to get all users (admin only)
router.get("/", checkAuthenticated, checkPermission(ACTIONS.READ, RESOURCES.USER), getUsers)

// Route to get a specific user by ID
router.get(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.USER),
  validate({ params: userIdSchema }),
  getUserById
)

// Route to update a user
router.patch(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE, RESOURCES.USER),
  validate({ params: userIdSchema, body: updateUserSchema }),
  updateUser
)

// Upload a profile image
router.post(
  "/:userId?/upload-profile-image",
  checkAuthenticated,
  checkPermission(ACTIONS.UPLOAD_PROFILE_IMAGE, RESOURCES.USER),
  validate({ params: userIdSchema }),
  imageUpload.single("profileImage"),
  uploadProfileImage
)

// Route to delete a user
router.delete(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.DELETE, RESOURCES.USER),
  validate({ params: userIdSchema }),
  deleteUser
)

export default router
