import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    publishYear: { type: Number },
    summary: { type: String },
    coverBookImage: {
      type: String,
      default:
        "https://img.freepik.com/photos-gratuite/art-numerique-belles-montagnes_23-2151123587.jpg?t=st=1737726580~exp=1737730180~hmac=a2a0d942b62d87fa0d5cfea321ae7ef0aeb7859167f37903a7877bb467fcf5eb&w=360",
    },
    tags: [{ type: String }],
    format: {
      type: String,
      enum: ["physical", "digital"],
      default: "digital",
      required: true,
    },
    availability: {
      type: String,
      enum: ["available", "unavailable", "reserved"],
      default: "available",
    },
    genre: [{ type: String }],
    pageCount: { type: Number, default: 0 },
    language: { type: String },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
)

bookSchema.plugin(mongoosePaginate)
bookSchema.plugin(mongooseAggregatePaginate)

const Book = mongoose.model("Book", bookSchema)

export default Book
