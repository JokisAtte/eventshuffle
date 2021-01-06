const Event = require("../../models/event")

const getAnEvent = async (request, response) => {
  const { id } = request.params
  const event = await Event.find({ id })
  if (event) {
    response.json(event)
  } else {
    response.status(404).end()
  }
}

module.exports = { getAnEvent }
