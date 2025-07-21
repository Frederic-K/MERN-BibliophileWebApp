import express from "express"
import {
  updateRegistrationStatus,
  getRegistrationStatus,
} from "../controllers/registration.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import validate from "../middleware/validation.js"
import { registrationStatusSchema } from "../validations/registration.validation.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

// Route to update registration status - only super admins can update
router.patch(
  "/registration-status",
  checkAuthenticated,
  checkPermission(ACTIONS.MANAGE_REGISTRATION, RESOURCES.REGISTRATION),
  validate({ body: registrationStatusSchema }),
  updateRegistrationStatus
)

// Route to get registration status - admins and super admins can read
router.get(
  "/registration-status",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.REGISTRATION),
  getRegistrationStatus
)

export default router
