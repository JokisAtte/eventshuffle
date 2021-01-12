const mongoose = require("mongoose")

const voteSchema = mongoose.Schema({
  date: [Date],
  people: [String],
})

voteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = voteSchema
