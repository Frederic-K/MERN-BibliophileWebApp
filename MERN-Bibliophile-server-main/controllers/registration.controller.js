// Version : express-async-errors
import Registration from "../models/registration.model.js"
import logger from "../utils/logger.js"

export const updateRegistrationStatus = async (req, res, next) => {
  const { isOpen, message } = req.body

  const status = await Registration.findOneAndUpdate(
    {},
    { isOpen, message },
    { new: true, upsert: true }
  )

  logger.info(`Registration status updated to: ${isOpen}`) // Log the update
  res.status(200).json({ message: "Registration status updated successfully", status })
}

export const getRegistrationStatus = async (req, res, next) => {
  const status = await Registration.findOne()

  if (!status) {
    return res.status(404).json({ message: "Registration status not found" })
  }

  res.status(200).json({ status })
}
