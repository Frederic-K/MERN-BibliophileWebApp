import express from "express"
import { globalSearch } from "../controllers/search.controller.js"
import checkAuthenticated from "../middleware/checkAuthenticated.js"
import checkPermission from "../middleware/checkPermission.js"
import validate from "../middleware/validation.js"
import { searchSchema } from "../validations/search.validation.js"
import { ACTIONS, RESOURCES } from "../constants/permission.constants.js"

const router = express.Router()

router.get(
  "/:userId?",
  checkAuthenticated,
  checkPermission(ACTIONS.READ, RESOURCES.SEARCH),
  validate({ query: searchSchema }),
  globalSearch
)

export default router
