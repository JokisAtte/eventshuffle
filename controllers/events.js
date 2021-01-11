const eventRouter = require("express").Router()

<<<<<<< HEAD
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
  let event = await Event.find({ id })
  event = event[0]
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
  response.status(201).json({ id })
})

eventRouter.post("/event/:id/vote", async (request, response) => {
  const { id } = request.params
  const { name: voterName, votes: newVotes } = request.body

  let event = await Event.find({
    id,
  }) //returns a list, take event [0]
  event = event[0]
  const { name, dates, votes } = event

  for (let i = 0; i < votes.length; i++) {
    if (
      newVotes.includes(votes[i].date) &&
      !votes[i].people.includes(voterName)
    ) {
      votes[i].people.push(voterName)
      logger.info(`Vote for ${votes[i].date} by ${voterName} added`)
    }
  }

  const newEvent = new Event({
    id,
    name,
    dates,
    votes: event.votes,
  })

  //Could use Event.findOneAndUpdate instead of delete and then save
  await Event.findOneAndDelete({ id })
  await newEvent.save()
  response.json(newEvent)
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
=======
const { getAllEvents } = require("./api/getAllEvents")
const { getAnEvent } = require("./api/getAnEvent")
const { postNewEvent } = require("./api/postNewEvent")
const { postNewVote } = require("./api/postNewVote")
const { getResult } = require("./api/getResult")

eventRouter.route("/list").get(getAllEvents)
eventRouter.route("/:id").get(getAnEvent)
eventRouter.route("/").post(postNewEvent)
eventRouter.route("/:id/vote").post(postNewVote)
eventRouter.route("/:id/results").get(getResult)
>>>>>>> 8b849ff18f1ee7daa9e2efa5bb086d54fffebbd1

module.exports = eventRouter
