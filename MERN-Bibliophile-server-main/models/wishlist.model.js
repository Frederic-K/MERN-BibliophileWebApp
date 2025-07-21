import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const wishlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  { timestamps: true }
)

wishlistSchema.plugin(mongoosePaginate)
const Wishlist = mongoose.model("Wishlist", wishlistSchema)

export default Wishlist
