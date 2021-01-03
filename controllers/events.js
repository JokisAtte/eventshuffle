const { response } = require("express")
const low = require("lowdb")
const Filesync = require("lowdb/adapters/FileSync")
const eventRouter = require("express").Router()

const { nameTaken, idTaken } = require("../utils/validators/index")
const { generateId, logger, getUniqueVoters } = require("../utils/index")

const adapter = new Filesync("db.json")
const db = low(adapter)

eventRouter.get("/event/list", (request, response) => {
  const events = db.get("events").value()
  const simplifiedEvents = events.map(({ id, name }) => ({
    id,
    name,
  }))
  response.json({ events: simplifiedEvents })
})

eventRouter.get("/event/:id", (request, response) => {
  const { id } = request.params
  if (!idTaken(id)) {
    response.status(404).send("Event id not found")
    return
  }
  response.json(db.get("events").find({ id }).value())
})

eventRouter.post("/event", (request, response) => {
  const { name, dates } = request.body
  if (nameTaken(name)) {
    response.status(400).send("Error: Event name already in use")
    return
  }

  const votes = dates.map((date) => ({ date, people: [] }))
  const id = generateId()
  db.get("events")
    .push({
      id,
      name,
      dates,
      votes,
    })
    .write()
  response.status(201).json({ id })
})

eventRouter.post("/event/:id/vote", (request, response) => {
  const { id } = request.params
  if (!idTaken(id)) {
    response.status(404).send("Event id not found")
    return
  }

  const { name, votes: newVotes } = request.body
  const event = db.get("events").find({ id }).value()

  for (let i = 0; i < event.votes.length; i++) {
    if (
      newVotes.includes(event.votes[i].date) &&
      !event.votes[i].people.includes(name)
    ) {
      event.votes[i].people.push(name)
      logger.info(`Vote for ${event.votes[i].date} by ${name} added`)
    } else if (event.votes[i].people.includes(name)) {
      logger.error(`User ${name} already voted for ${event.votes[i].date} `)
    }
  }
  //Deleting and then writing might not be the best practice performance wise,
  //but others didnt work
  db.get("events").remove({ id }).write()
  db.get("events").push(event).write()
  response.json(event)
})

eventRouter.get("/event/:id/results", (request, response) => {
  const { id } = request.params
  if (!idTaken(id)) {
    response.status(404).send("Event id not found")
    return
  }

  const { votes, name } = db.get("events").find({ id }).value()
  let uniqueVoters = []
  let suitableDates = []
  if (votes.length) {
    uniqueVoters = getUniqueVoters(votes)
    for (let i = 0; i < votes.length; i++) {
      //comparing element wise might be faster than using stringify
      console.log(
        JSON.stringify(votes[i].people) == JSON.stringify(uniqueVoters)
      )
      if (JSON.stringify(votes[i].people) == JSON.stringify(uniqueVoters)) {
        suitableDates = suitableDates.concat(votes[i])
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
