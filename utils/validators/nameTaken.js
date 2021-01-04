const Event = require("../../models/event")

const nameTaken = (name) => {
  const event = Event.find({ name })
  console.log(event)
  if (event) {
    return true
  }
  return false
}

module.exports = {
  nameTaken,
}
