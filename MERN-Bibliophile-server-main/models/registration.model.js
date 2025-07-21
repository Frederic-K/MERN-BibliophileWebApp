import mongoose from "mongoose"

const registrationSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    default: true, // Par défaut, les inscriptions sont fermées
  },
})

const Registration = mongoose.model("Registration", registrationSchema)

export default Registration
