const Event = require("../../models/event")

const getAnEvent = async (request, response) => {
  const { id } = request.params
  await Event.find({ id }).then((event) => {
    if (event) {
      response.json(event[0])
    } else {
      response.status(404).end()
    }
  })
}

module.exports = { getAnEvent }
