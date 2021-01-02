const { response } = require("express")
const low = require("lowdb")
const Filesync = require("lowdb/adapters/FileSync")
const { map } = require("../app")
const eventRouter = require("express").Router()
const logger = require("../utils/logger")

const adapter = new Filesync("db.json")
const db = low(adapter)

eventRouter.get("/event/list", (request, response) => {
  const events = db.get("events").value()
  response.json(events)
})

eventRouter.get("/event/:id", (request, response) => {
  const { id } = request.params
  const event = db.get("events").find({ id: id }).value()
  response.json(event)
})

eventRouter.post("/event", (request, response) => {
  const { body } = request

  if (nameTaken(body.name)) {
    response.status(400).send("Error: Event name already in use")
    return
  }

  let votes = []
  for (let i = 0; i < body.dates.length; i++) {
    console.log("date:", body.dates[i])
    const newVote = {
      date: body.dates[i],
      people: [],
    }
    console.log(newVote)
    votes.push(newVote)
  }

  const id = generateId()
  const { name, dates } = body
  db.get("events")
    .push({
      id,
      name,
      dates,
      votes,
    })
    .write()
  response.status(201).json({ id: id })
})

eventRouter.post("/event/:id/vote", (request, response) => {
  const { id } = request.params
  if (!idExists(id)) {
    response.status(404).send("Event id not found")
    return
  }

  const { name, votes } = request.body
  const event = db.get("events").find({ id }).value()

  for (let i = 0; i < event.votes.length; i++) {
    if (
      votes.includes(event.votes[i].date) &&
      !event.votes[i].people.includes(name)
    ) {
      event.votes[i].people.push(name)
      logger.info("Vote added")
    } else if (event.votes[i].people.includes(name)) {
      logger.error("User already voted this date")
    }
  }
  db.get("events").remove({ id }).write()
  db.get("events").push(event).write()
  response.json(event)
})

eventRouter.get("/event/:id/results", (request, response) => {
  const { id } = request.params
  const { votes, name } = db.get("events").find({ id }).value()
  console.log(votes)
  const uniqueVoters = getUniqueVoters(votes)
  console.log("----")
  console.log(votes[0].people)
  console.log(uniqueVoters)
  console.log("----")
  let suitableDates = []
  for (let i = 0; i < votes.length; i++) {
    console.log(JSON.stringify(votes[i].people) == JSON.stringify(uniqueVoters))
    if (JSON.stringify(votes[i].people) == JSON.stringify(uniqueVoters)) {
      suitableDates = suitableDates.concat(votes[i])
    }
  }
  console.log(suitableDates)
  const result = {
    id,
    name,
    suitableDates,
  }
  response.json(result)
})

const getUniqueVoters = (votes) => {
  let allVotes = []
  for (let date of votes) {
    allVotes = allVotes.concat(date.people)
  }
  return allVotes.filter(unique)
}

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

const generateId = () => {
  const events = db.get("events").value()
  const ids = events.map((event) => event.id)
  let newId
  for (let i = 0; i <= ids.length; i++) {
    if (!ids.includes(i.toString())) {
      newId = i
    }
    if ((i = ids.length)) {
      newId = i
    }
  }
  return newId.toString()
}

const nameTaken = (name) => {
  const events = db.get("events").value()
  const names = events.map((event) => event.name)
  if (names.includes(name)) {
    return true
  }
  return false
}

const idExists = (id) => {
  const ids = db
    .get("events")
    .value()
    .map((event) => event.id)
  if (ids.includes(id.toString())) {
    logger.info("Event found")
    return true
  }
  return false
}

module.exports = eventRouter
