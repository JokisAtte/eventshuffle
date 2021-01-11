const Event = require("../../models/event")

const getAllEvents = (request, response) => {
  Event.find({}).then((events) => {
    events = events.map(({ id, name }) => ({
      id,
      name,
    }))
    response.json({ events })
  })
}

module.exports = { getAllEvents }
