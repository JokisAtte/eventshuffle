const Event = require("../../models/event")

const idTaken = (id) => {
  const event = Event.findById(id)
  if (event) {
    return true
  }
  return false
}

module.exports = {
  idTaken,
}
