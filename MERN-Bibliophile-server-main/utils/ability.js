import { AbilityBuilder, createMongoAbility } from "@casl/ability"
import createError from "./createError.js"
import logger from "./logger.js"
// Import JSON in ES modules
// This approach is used because:
// 1.ES modules don't support direct JSON imports in all Node.js versions.
// 2.It provides better compatibility across different Node.js versions.
// 3.It allows synchronous loading of JSON, which is necessary in this context.
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const permissions = require("../config/permissions.json")

export function defineAbilityFor(user) {
  try {
    if (!user || !user.role) {
      logger.error("Invalid user object provided to defineAbilityFor")
      return next(createError("Invalid user object", 404))
    }

    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

    const roleRules = permissions[user.role] || []

    if (roleRules.length === 0) {
      logger.warn(`No permissions found for role: ${user.role}`)
    }

    roleRules.forEach((rule) => {
      if (rule.action === "manage" && rule.subject === "all") {
        can("manage", "all")
        logger.info(`Full permissions granted to role: ${user.role}`)
      } else {
        const conditions = rule.conditions
          ? JSON.parse(JSON.stringify(rule.conditions).replace(/\{userId\}/g, user._id))
          : undefined

        can(rule.action, rule.subject, conditions)
      }
    })

    return build()
  } catch (error) {
    logger.error(`Error defining ability: ${error.message}`)
    return next(createError("Error defining user abilities", 500))
  }
}
