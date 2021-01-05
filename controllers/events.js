const Event = require("../models/event")

const eventRouter = require("express").Router()

const {
  generateId,
  logger,
  getUniqueVoters,
  arraysEqual,
} = require("../utils/index")

eventRouter.get("/event/list", (request, response) => {
  Event.find({}).then((events) => {
    events = events.map(({ id, name }) => ({
      id,
      name,
    }))
    response.json({ events })
  })
})

eventRouter.get("/event/:id", async (request, response) => {
  const { id } = request.params
  const event = await Event.find({ id })
  if (event) {
    response.json(event)
  } else {
    response.status(404).end()
  }
})

eventRouter.post("/event", async (request, response) => {
  const { name, dates } = request.body
  const votes = dates.map((date) => ({ date, people: [] }))
  const id = generateId()
  const event = new Event({
    id,
    name,
    dates,
    votes,
  })
  await event.save()
  response.json({ id })
})

eventRouter.post("/event/:id/vote", async (request, response) => {
  const { id } = request.params
  const { name: voterName, votes: newVotes } = request.body

  let event = await Event.find({
    id,
  }) //returns a list, take event [0]
  event = event[0]
  const { votes } = event

  for (let i = 0; i < votes.length; i++) {
    if (
      newVotes.includes(votes[i].date) &&
      !votes[i].people.includes(voterName)
    ) {
      votes[i].people.push(voterName)
      logger.info(`Vote for ${votes[i].date} by ${voterName} added`)
    }
  }

  await event.save()
  response.json(event)
})

eventRouter.get("/event/:id/results", async (request, response) => {
  const { id } = request.params

  let event = await Event.find({
    id,
  }) //returns a list, take event [0]
  const { votes, name } = event[0]

  let uniqueVoters = []
  let suitableDates = []

  if (votes.length) {
    uniqueVoters = getUniqueVoters(votes)
    for (let i = 0; i < votes.length; i++) {
      if (arraysEqual(votes[i].people, uniqueVoters)) {
        suitableDates.push(votes[i])
      }
    }
  }

  const result = {
    id,
    name,
    suitableDates,
  }

  response.json(result)
})

module.exports = eventRouter
