import User from "../models/user.model.js"
import logger from "../utils/logger.js"

export async function cleanupExpiredTokens() {
  const now = new Date()

  try {
    const result = await User.updateMany(
      {
        $or: [{ resetPasswordExpires: { $lt: now } }, { emailChangeTokenExpires: { $lt: now } }],
      },
      {
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
          pendingEmail: "",
          emailChangeToken: "",
          emailChangeTokenExpires: "",
        },
      }
    )

    logger.info(`Cleaned up ${result.nModified} user documents with expired tokens.`)
  } catch (error) {
    logger.error("Error during token cleanup:", error)
  }
}
