import express from "express"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"
import { getUserStats } from "../controllers/stat.controller.js"

const router = express.Router()

// Get user statistics
router.get("/", checkAuthenticated, checkPermission(ACTIONS.READ, RESOURCES.STATS), getUserStats)

export default router
