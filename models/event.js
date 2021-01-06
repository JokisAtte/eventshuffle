const mongoose = require("mongoose")
const voteSchema = require("./vote")

const eventSchema = mongoose.Schema({
  id: Number,
  name: String,
  dates: Array,
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
