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
  let simplifiedEvents = []
  for (let i = 0; i < events.length; i++) {
    const { id, name } = events[i]
    const event = {
      id,
      name,
    }
    simplifiedEvents.push(event)
  }
  response.json({ events: simplifiedEvents })
})

eventRouter.get("/event/:id", (request, response) => {
  const { id } = request.params
  if (!idExists(id)) {
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

  let votes = [] //Empty array for vote objects
  for (let i = 0; i < dates.length; i++) {
    const initializedVote = {
      date: dates[i],
      people: [],
    }
    votes.push(initializedVote)
  }

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
  if (!idExists(id)) {
    response.status(404).send("Event id not found")
    return
  }

  const { votes, name } = db.get("events").find({ id }).value()
  let uniqueVoters = []
  let suitableDates = []
  if (votes.length > 0) {
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
