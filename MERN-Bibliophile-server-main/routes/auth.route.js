import express from "express"
import {
  signupUser,
  signinUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUserEmail,
  verifyUserNewEmail,
} from "../controllers/auth.controller.js"
import {
  signUpSchema,
  signInSchema,
  resetPasswordBodySchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  updateEmailBodySchema,
  userIdSchema,
  tokenSchema,
} from "../validations/auth.validation.js"
import registration from "../middleware/registration.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import validate from "../middleware/validation.js"
import checkPermission from "../middleware/checkPermission.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Public routes
router.post("/signup", registration, validate({ body: signUpSchema }), signupUser)

router.post("/signin", validate({ body: signInSchema }), signinUser)

router.get("/verify-email/:token", validate({ params: tokenSchema }), verifyEmail)

router.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword)

router.post(
  "/reset-password/:token",
  validate({ body: resetPasswordBodySchema, params: tokenSchema }),
  resetPassword
)

router.get("/verify-new-email/:token", validate({ params: tokenSchema }), verifyUserNewEmail)

// Protected routes
router.post(
  "/logout",
  checkAuthenticated,
  checkPermission(ACTIONS.LOGOUT, RESOURCES.AUTH),
  logoutUser
)

router.post(
  "/update-password",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE_PASSWORD, RESOURCES.AUTH),
  validate({ body: updatePasswordSchema }),
  updatePassword
)

router.post(
  "/update-email/:userId",
  checkAuthenticated,
  checkPermission(ACTIONS.UPDATE_EMAIL, RESOURCES.AUTH),
  validate({ body: updateEmailBodySchema, params: userIdSchema }),
  updateUserEmail
)

export default router
