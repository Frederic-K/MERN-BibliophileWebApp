import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const authorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date },
    deathDate: { type: Date },
    bio: { type: String },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Array of references (_id) to Book
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true }
)

authorSchema.plugin(mongoosePaginate)
authorSchema.plugin(mongooseAggregatePaginate)

const Author = mongoose.model("Author", authorSchema)

export default Author
