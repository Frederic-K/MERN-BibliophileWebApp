import config from "../config/config.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import {
  sendVerificationEmail,
  sendEmailChangeRequestNotification,
  sendEmailChangeConfirmation,
  sendPasswordResetEmail,
  sendPasswordChangeNotification,
} from "../utils/mailer.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"
import { buildFrontendUrl } from "../utils/url.js"

// Signup a new user
export const signupUser = async (req, res, next) => {
  const { userName, email, password, language } = req.body

  // Check if username already exists
  const existingUsername = await User.findOne({ userName })
  if (existingUsername) {
    return next(createError("Username already exists", 400))
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email })
  if (existingEmail) {
    return next(createError("Email already exists", 400))
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const verificationToken = crypto.randomBytes(32).toString("hex")
  const tokenExpirationTime = 3600000 // 1 hour in milliseconds
  const verificationTokenExpires = new Date(Date.now() + tokenExpirationTime)

  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
  })

  await newUser.save()

  const verificationLink = buildFrontendUrl("verify-email/:token", {
    lang: language || "en",
    params: {
      token: verificationToken,
    },
  })

  await sendVerificationEmail(email, verificationLink, next)
  logger.info(`User registered: ${newUser._id}`)
  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
  })
}

// Signin a user
export const signinUser = async (req, res, next) => {
  const { userName, password } = req.body
  const user = await User.findOne({ userName })

  if (!user || !user.isAuthorized) {
    logger.warn(`Signin failed: Invalid username - ${userName}`)
    return next(createError("Invalid username or password", 401))
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    logger.warn(`Signin failed: Invalid password for username - ${userName}`)
    return next(createError("Invalid username or password", 401))
  }

  // Clear sensitive fields based on configuration
  if (config.clearSensitiveFieldsOnSignIn) {
    await user.clearSensitiveFields(config.clearSensitiveFieldsOptions)
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtPrivateKey, {
    expiresIn: "24h",
  })

  logger.info(`User signed in: ${user._id}`)
  const isProduction = process.env.NODE_ENV === "production"
  const { password: _, ...userData } = user._doc

  res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: isProduction })
    .json({ ...userData, message: "User signed in successfully" })
}

// Controller to logout a user
// Init not async, because it's not necessary to wait for the database operation to complete as i don't storeit to db
// But set "async to handle the case when the database operation fails
// Allow custom management of the error
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // expires: new Date(0), // The res.clearCookie method will automatically set cookies to expire immediately in Express 5.0.0
    })

    logger.info(`User logged out: ${req.user ? req.user._id : "Unknown"}`)
    res.status(200).json({ message: "User logged out successfully" })
  } catch (error) {
    logger.error(`Logout error: ${error.message}`)
    next(createError("Logout failed", 500))
  }
}

// Verify email
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  })

  if (!user) {
    logger.warn(`Invalid or expired token used: ${token}`)
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired verification link. Please request a new one.",
    })
  }

  if (user.isAuthorized) {
    logger.info(`Already verified email for user: ${user._id}`)
    return res.status(200).json({
      status: "already_verified",
      message: "Email already verified. You can now log in.",
      email: user.email,
    })
  }

  user.isAuthorized = true
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save()

  logger.info(`Email verified successfully for user: ${user._id}`)
  res.status(200).json({
    status: "verified",
    message: "Email verified successfully. You can now log in.",
    email: user.email,
  })
}

// Update user email
export const updateUserEmail = async (req, res, next) => {
  const { newEmail, language } = req.body
  const { userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    logger.warn(`User not found for email update with ID: ${userId}`)
    return next(createError("User not found", 404))
  }

  // Check if new email is the same as current email
  if (user.email === newEmail) {
    logger.warn(`Email update failed: New email is the same as current email - ${newEmail}`)
    return next(createError("New email is the same as current email", 400))
  }

  // Check if the new email is already in use
  const existingUser = await User.findOne({ email: newEmail })
  if (existingUser) {
    logger.warn(`Email update failed: New email is already in use - ${newEmail}`)
    return next(createError("Email is already in use", 400))
  }

  const emailChangeToken = crypto.randomBytes(32).toString("hex")
  user.emailChangeToken = emailChangeToken
  user.emailChangeTokenExpires = new Date(Date.now() + 3600000) // 1 hour
  user.pendingEmail = newEmail

  await user.save()

  const verificationLink = buildFrontendUrl("verify-new-email/:token", {
    lang: language || "en",
    params: {
      token: emailChangeToken,
    },
  })

  // Send verification email to the new email address
  await sendVerificationEmail(newEmail, verificationLink, next)

  // Send notification to the old email address
  await sendEmailChangeRequestNotification(user.email, newEmail, next)

  logger.info(
    `Verification email sent to: ${newEmail} and notification sent to: ${user.email} for user: ${user._id}`
  )
  res.status(200).json({
    message:
      "Verification email sent to new address. A notification has been sent to your current email.",
  })
}

// Verify new email
export const verifyUserNewEmail = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({
    emailChangeToken: token,
    emailChangeTokenExpires: { $gt: new Date() },
  })

  if (!user) {
    logger.warn(`No user found with valid token: ${token}`)
    return next(createError(400, "Invalid or expired token"))
  }

  if (user.email === user.pendingEmail) {
    logger.info(`Email already updated for user: ${user._id}`)
    return res.status(200).json({
      status: "already_verified",
      message: "Email has already been updated. No further action is needed.",
      email: user.email,
    })
  }

  const oldEmail = user.email
  user.email = user.pendingEmail
  user.pendingEmail = undefined
  user.emailChangeToken = undefined
  user.emailChangeTokenExpires = undefined

  await user.save()

  // Send confirmation to the new email address
  await sendEmailChangeConfirmation(user.email)

  // Send notification to the old email address
  await sendEmailChangeConfirmation(oldEmail)

  logger.info(`Email updated successfully for user: ${user._id}`)
  res.status(200).json({
    status: "verified",
    message: "Email updated successfully. Confirmations sent to both old and new email addresses.",
    email: user.email,
  })
}

// Request a password reset
export const forgotPassword = async (req, res, next) => {
  const { email, language } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    logger.warn(`Password reset requested for non-existent email: ${email}`)
    return next(createError("User not found", 404))
  }

  user.resetPasswordToken = crypto.randomBytes(32).toString("hex")
  user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour

  await user.save()

  const resetPasswordLink = buildFrontendUrl("reset-password/:token", {
    lang: language || "en",
    params: {
      token: user.resetPasswordToken,
    },
  })

  // Send password reset email to the user
  await sendPasswordResetEmail(email, resetPasswordLink, next)

  logger.info(`Password reset link sent to: ${email}`)
  res.status(200).json({ message: "Password reset link sent" })
}

// Reset password
export const resetPassword = async (req, res, next) => {
  const { token } = req.params
  const { newPassword } = req.body

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    logger.error(`Password reset failed: Invalid or expired token - ${token}`)
    return next(createError("Invalid or expired token", 400))
  }

  user.password = await bcrypt.hash(newPassword, 10)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined

  await user.save()

  logger.info(`Password reset successfully for user: ${user._id}`)
  res.status(200).json({ message: "Password reset successfully" })
}

// // Update password
// export const updatePassword = async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body
//   const userId = req.user._id

//   const user = await User.findById(userId)
//   if (!user) {
//     return next(createError("User not found", 404))
//   }

//   const isMatch = await bcrypt.compare(currentPassword, user.password)
//   if (!isMatch) {
//     logger.warn(`Failed password update attempt for user: ${user._id}`)
//     return next(createError("Current password is incorrect", 400))
//   }

//   user.password = await bcrypt.hash(newPassword, 10)

//   await user.save()

//   // Send notification email
//   await sendPasswordChangeNotification(user.email, next)

//   logger.info(`Password updated successfully for user: ${user._id}`)
//   res
//     .status(200)
//     .json({ message: "Password updated successfully. Please log in again with your new password." })
// }

// Update password
export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body
  const userId = req.user._id

  // Check if all required fields are provided
  if (!currentPassword) {
    logger.warn(`Current password missing in update password attempt for user: ${userId}`)
    return next(createError("Current password is required", 400))
  }

  if (!newPassword || !confirmNewPassword) {
    logger.warn(
      `New password or confirmation missing in update password attempt for user: ${userId}`
    )
    return next(createError("New password and confirmation are required", 400))
  }

  // Check if new password and confirmation match
  if (newPassword !== confirmNewPassword) {
    logger.warn(`New password and confirmation do not match for user: ${userId}`)
    return next(createError("New password and confirmation do not match", 400))
  }

  const user = await User.findById(userId)
  if (!user) {
    logger.warn(`User not found for password update with ID: ${userId}`)
    return next(createError("User not found", 404))
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    logger.warn(`Failed password update attempt for user: ${user._id}`)
    return next(createError("Current password is incorrect", 400))
  }

  // Check if the new password is different from the current password
  if (currentPassword === newPassword) {
    logger.warn(`New password is the same as current password for user: ${user._id}`)
    return next(createError("New password must be different from the current password", 400))
  }

  user.password = await bcrypt.hash(newPassword, 10)

  await user.save()

  // Send notification email
  await sendPasswordChangeNotification(user.email, next)

  logger.info(`Password updated successfully for user: ${user._id}`)
  res
    .status(200)
    .json({ message: "Password updated successfully. Please log in again with your new password." })
}
