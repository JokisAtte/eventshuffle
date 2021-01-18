const mongoose = require("mongoose")

const voteSchema = mongoose.Schema({
  date: String,
  people: [],
})

voteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = voteSchema
