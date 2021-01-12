const Event = require("../../models/event")
const { generateId } = require("../../utils/index")

const postNewEvent = async (request, response) => {
  const { name, dates, id: idParam } = request.body
  const votes = dates.map((date) => ({ date, people: [] }))
  const id = idParam || generateId()
  const event = new Event({
    id,
    name,
    dates,
    votes,
  })
  await event.save()
  response.json({ id })
}

module.exports = { postNewEvent }
