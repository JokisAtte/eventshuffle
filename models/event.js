const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({
  id: Number,
  name: String,
  dates: Array,
  votes: Array,
})

eventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Event", eventSchema)
