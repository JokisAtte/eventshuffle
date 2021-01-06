const mongoose = require("mongoose")
const voteSchema = require("./vote")

const eventSchema = mongoose.Schema({
  id: Number,
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  dates: {
    type: Array,
    minlength: 1,
    required: true,
  },
  votes: [voteSchema],
})

eventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = parseInt(returnedObject.id)
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Event", eventSchema)
