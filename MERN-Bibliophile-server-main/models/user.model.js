import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png",
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "superAdmin"],
      default: "user",
    },
    isAuthorized: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    pendingEmail: {
      type: String,
    },
    emailChangeToken: {
      type: String,
    },
    emailChangeTokenExpires: {
      type: Date,
    },
    bookshelf: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserBookshelfItem",
      },
    ],
    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
  },
  { timestamps: true }
)
// Clear sensitive fields
userSchema.methods.clearSensitiveFields = async function (options = {}) {
  const fieldsToClean = {
    resetPasswordToken: options.clearResetPassword !== false,
    resetPasswordExpires: options.clearResetPassword !== false,
    pendingEmail: options.clearPendingEmail !== false,
    emailChangeToken: options.clearEmailChange !== false,
    emailChangeTokenExpires: options.clearEmailChange !== false,
  }

  for (const [field, shouldClear] of Object.entries(fieldsToClean)) {
    if (shouldClear) {
      this[field] = undefined
    }
  }

  if (options.save !== false) {
    await this.save()
  }
}

// Remove unverified users after 1 hour
userSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600, partialFilterExpression: { isAuthorized: false } }
)

userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseAggregatePaginate)

const User = mongoose.model("User", userSchema)

export default User
