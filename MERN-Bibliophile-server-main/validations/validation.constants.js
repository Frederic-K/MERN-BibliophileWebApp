import joiObjectId from "joi-objectid"
import Joi from "joi"

// Extend Joi with ObjectId validation and export the extended instance
export const extendJoiWithObjectId = (joi) => {
  joi.objectId = joiObjectId(joi)
  return joi
}

export const JoiExtended = extendJoiWithObjectId(Joi)

// Common regex patterns
export const PATTERNS = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  NAME: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
}

// Common validation rules
export const RULES = {
  USERNAME: {
    min: 3,
    max: 30,
  },
  PASSWORD: {
    min: 8,
  },
  EMAIL: {
    minDomainSegments: 2,
  },
  NAME: {
    min: 2,
    max: 50,
  },
  TITLE: {
    min: 1,
    max: 200,
  },
  SUMMARY: {
    max: 5000,
  },
}

// Common validation messages
export const MESSAGES = {
  PASSWORD: {
    pattern:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    min: "Password must be at least 8 characters long",
    required: "Password is required",
    match: "Passwords do not match",
  },
  EMAIL: {
    invalid: "Please enter a valid email address",
    required: "Email is required",
  },
  USERNAME: {
    pattern: "Username can only contain alphanumeric characters, underscores, and hyphens",
    min: "Username must be at least 3 characters long",
    max: "Username cannot exceed 30 characters",
    required: "Username is required",
  },
  NAME: {
    pattern: "Name can only contain letters, spaces, hyphens, and apostrophes",
    min: "Name must be at least 2 characters long",
    max: "Name cannot exceed 50 characters",
  },
  OBJECTID: {
    invalid: "Invalid ID format",
    required: "ID is required",
  },
  COMMON: {
    required: "This field is required",
    string: {
      min: "Must be at least {#limit} characters long",
      max: "Cannot exceed {#limit} characters",
      empty: "This field cannot be empty",
      valid: "Must be one of the allowed values",
      base: "Must be a string",
      uri: "Must be a valid URL",
    },
    number: {
      min: "Cannot be less than {#limit}",
      max: "Cannot be more than {#limit}",
      base: "Must be a number",
      integer: "Must be a whole number",
    },
    date: {
      min: "Cannot be before {#limit}",
      max: "Cannot be after {#limit}",
      base: "Must be a valid date",
    },
    array: {
      min: "Must have at least {#limit} items",
      max: "Cannot have more than {#limit} items",
      base: "Must be an array",
    },
    boolean: {
      base: "Must be true or false",
    },
  },
}

// Validators
export const Validators = {
  objectId: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.objectId().messages({
      "string.pattern.name": customMessage?.invalid || MESSAGES?.OBJECTID?.invalid,
    })

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.OBJECTID?.required,
        })
      : validator
  },

  string: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string().messages({
      "string.base": customMessage?.base || MESSAGES?.COMMON?.string?.base || "Must be a string",
      "string.empty": customMessage?.empty || MESSAGES?.COMMON?.string?.empty || "Cannot be empty",
    })

    if (options?.min) {
      validator = validator.min(options.min).messages({
        "string.min":
          customMessage?.min ||
          MESSAGES?.COMMON?.string?.min?.replace("{#limit}", options.min) ||
          `Must be at least ${options.min} characters long`,
      })
    }

    if (options?.max) {
      validator = validator.max(options.max).messages({
        "string.max":
          customMessage?.max ||
          MESSAGES?.COMMON?.string?.max?.replace("{#limit}", options.max) ||
          `Cannot exceed ${options.max} characters`,
      })
    }

    if (options?.pattern) {
      validator = validator.pattern(options.pattern).messages({
        "string.pattern.base": customMessage?.pattern || "Invalid format",
      })
    }

    if (options?.valid) {
      validator = validator.valid(...options.valid).messages({
        "any.only":
          customMessage?.valid ||
          MESSAGES?.COMMON?.string?.valid ||
          `Must be one of: ${options.valid.join(", ")}`,
      })
    }

    if (options?.default) {
      validator = validator.default(options.default)
    }

    if (options?.allow) {
      validator = validator.allow(...options.allow)
    }

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.COMMON?.required,
        })
      : validator
  },

  username: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string()
      .min(RULES?.USERNAME?.min)
      .max(RULES?.USERNAME?.max)
      .pattern(PATTERNS?.USERNAME)
      .messages({
        "string.pattern.base": customMessage?.pattern || MESSAGES?.USERNAME?.pattern,
        "string.min": customMessage?.min || MESSAGES?.USERNAME?.min,
        "string.max": customMessage?.max || MESSAGES?.USERNAME?.max,
      })

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.USERNAME?.required,
        })
      : validator
  },

  password: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string()
      .min(RULES?.PASSWORD?.min)
      .pattern(PATTERNS?.PASSWORD)
      .messages({
        "string.pattern.base": customMessage?.pattern || MESSAGES?.PASSWORD?.pattern,
        "string.min": customMessage?.min || MESSAGES?.PASSWORD?.min,
      })

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.PASSWORD?.required,
        })
      : validator
  },

  email: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string()
      .email({ minDomainSegments: RULES?.EMAIL?.minDomainSegments })
      .messages({
        "string.email": customMessage?.invalid || MESSAGES?.EMAIL?.invalid,
      })

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.EMAIL?.required,
        })
      : validator
  },

  name: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string()
      .min(RULES?.NAME?.min)
      .max(RULES?.NAME?.max)
      .pattern(PATTERNS?.NAME)
      .messages({
        "string.pattern.base": customMessage?.pattern || MESSAGES?.NAME?.pattern,
        "string.min": customMessage?.min || MESSAGES?.NAME?.min,
        "string.max": customMessage?.max || MESSAGES?.NAME?.max,
      })

    return options?.required ? validator.required() : validator
  },

  date: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.date().messages({
      "date.base": customMessage?.base || MESSAGES?.COMMON?.date?.base,
    })

    if (options?.min) {
      validator = validator.min(options.min).messages({
        "date.min": customMessage?.min || MESSAGES?.COMMON?.date?.min,
      })
    }

    if (options?.max) {
      validator = validator.max(options.max).messages({
        "date.max": customMessage?.max || MESSAGES?.COMMON?.date?.max,
      })
    }

    return options?.required ? validator.required() : validator.allow(null, "")
  },

  number: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.number().messages({
      "number.base": customMessage?.base || MESSAGES?.COMMON?.number?.base,
    })

    if (options?.integer) {
      validator = validator.integer().messages({
        "number.integer": customMessage?.integer || MESSAGES?.COMMON?.number?.integer,
      })
    }

    if (typeof options?.min === "number") {
      validator = validator.min(options.min).messages({
        "number.min": customMessage?.min || MESSAGES?.COMMON?.number?.min,
      })
    }

    if (typeof options?.max === "number") {
      validator = validator.max(options.max).messages({
        "number.max": customMessage?.max || MESSAGES?.COMMON?.number?.max,
      })
    }

    return options?.required ? validator.required() : validator.optional()
  },

  array: (itemSchema, options = {}, customMessage = {}) => {
    let validator = JoiExtended.array()
      .items(itemSchema)
      .messages({
        "array.base": customMessage?.base || MESSAGES?.COMMON?.array?.base,
      })

    if (options?.min) {
      validator = validator.min(options.min).messages({
        "array.min": customMessage?.min || MESSAGES?.COMMON?.array?.min,
      })
    }

    if (options?.max) {
      validator = validator.max(options.max).messages({
        "array.max": customMessage?.max || MESSAGES?.COMMON?.array?.max,
      })
    }

    return options?.required ? validator.required() : validator.optional()
  },

  boolean: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.boolean().messages({
      "boolean.base": customMessage?.base || MESSAGES?.COMMON?.boolean?.base,
    })

    return options?.required ? validator.required() : validator.optional()
  },

  url: (options = {}, customMessage = {}) => {
    let validator = JoiExtended.string()
      .uri({
        scheme: options?.scheme || ["http", "https"],
        domain: options?.domain || undefined,
      })
      .messages({
        "string.uri": customMessage?.uri || "Must be a valid URL",
        "string.base": customMessage?.base || "Must be a string",
      })

    if (options?.allow) {
      validator = validator.allow(...options.allow)
    }

    return options?.required
      ? validator.required().messages({
          "any.required": customMessage?.required || MESSAGES?.COMMON?.required,
        })
      : validator
  },
}
