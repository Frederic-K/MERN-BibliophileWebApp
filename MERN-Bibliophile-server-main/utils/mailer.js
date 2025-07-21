import config from "../config/config.js"
import createTransporter from "../config/mailer.config.js"
import { sendEmailSchema } from "../validations/sendEmail.validation.js"
import createError from "../utils/createError.js"
import logger from "../utils/logger.js"

// General function to send an email
export const sendMail = async ({ to, subject, html }, next) => {
  // Validate email data
  const { error } = sendEmailSchema.validate({ to, subject, html })
  if (error) {
    logger.error(`Email validation error: ${error.details[0].message}`)
    return next(createError(`Email validation error: ${error.details[0].message}`, 400))
  }

  logger.info(`Sending email to: ${to}, subject: ${subject}`)

  // Create mail options
  const mailOptions = {
    from: config.emailFrom,
    to,
    subject,
    html,
  }

  // Send email
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail(mailOptions)
    logger.info(`Email sent successfully: ${info.messageId}`)
    return info
  } catch (err) {
    logger.error(`Error sending email: ${err.message}`)
    return next(createError("Failed to send email", 500))
  }
}

// Function to send a verification email
export const sendVerificationEmail = async (to, verificationLink, next) => {
  const subject = "Verify your email"
  const html = `
    <h1>Welcome to Our Service</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
  `
  return sendMail({ to, subject, html }, next)
}

// Notification sent to the current email address when a change request is initiated
export const sendEmailChangeRequestNotification = async (to, newEmail, next) => {
  const subject = "Email Change Request"
  const html = `
    <h1>Email Change Request</h1>
    <p>We received a request to change your email address to ${newEmail}.</p>
    <p>If you did not request this change, please contact our support team immediately.</p>
  `
  return sendMail({ to, subject, html }, next)
}

// Confirmation sent to both the old and new email addresses after the change is completed
export const sendEmailChangeConfirmation = async (to, next) => {
  const subject = "Email Address Changed"
  const html = `
    <h1>Email Address Changed</h1>
    <p>This is to confirm that your email address has been successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
  `
  return sendMail({ to, subject, html }, next)
}

// Function to send a password reset email
export const sendPasswordResetEmail = async (to, resetLink, next) => {
  const subject = "Reset your password"
  const html = `
    <h1>Password Reset Request</h1>
    <p>You can reset your password by clicking the link below:</p>
    <a href="${resetLink}">Reset Password</a>
  `
  return sendMail({ to, subject, html }, next)
}

// Notification sent to the current email address when update a password
export const sendPasswordChangeNotification = async (to, next) => {
  const subject = "Your password has been changed"
  const html = `
    <h1>Password Change Notification</h1>
    <p>This email is to confirm that your password has been successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
  `
  return sendMail({ to, subject, html }, next)
}

// Function to send a wishlist email
export const sendWishlistByEmail = async (to, wishlistBooks, senderEmail, senderUsername, next) => {
  // Format the wishlist for email
  const formattedWishlist = wishlistBooks
    .map((book) => `Title: ${book.title}, Author: ${book.author}, Priority: ${book.priority}`)
    .join("\n")

  const subject = "Shared Wishlist"
  const html = `
    <h1>Shared Wishlist</h1>
    <p>${senderUsername} (${senderEmail}) has shared their wishlist with you:</p>
    <pre>${formattedWishlist}</pre>
    <p>If you have any questions about this wishlist, you can contact ${senderUsername} at ${senderEmail}.</p>
  `

  return sendMail({ to, subject, html }, next)
}
// Function to send a notification that the wishlist has been sent
export const sendWishlistSentNotification = async (to, recipientEmail, next) => {
  const subject = "Your Wishlist Has Been Sent"
  const html = `
    <h1>Wishlist Sent Confirmation</h1>
    <p>Your wishlist has been successfully sent to ${recipientEmail}.</p>
    <p>If you did not request this action, please contact our support team immediately.</p>
  `
  return sendMail({ to, subject, html }, next)
}
