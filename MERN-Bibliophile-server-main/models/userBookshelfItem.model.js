import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const userBookshelfItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, default: 1, min: 1, max: 5 },
    readStatus: {
      type: String,
      enum: ["to-read", "reading", "read"],
      default: "to-read",
    },
    startReadDate: { type: Date },
    endReadDate: { type: Date },
    isFavorite: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  { timestamps: true }
)

// Add a compound index for user and book to ensure uniqueness
userBookshelfItemSchema.index({ user: 1, book: 1 }, { unique: true })

userBookshelfItemSchema.plugin(mongoosePaginate)
userBookshelfItemSchema.plugin(mongooseAggregatePaginate)

const UserBookshelfItem = mongoose.model("UserBookshelfItem", userBookshelfItemSchema)

export default UserBookshelfItem
