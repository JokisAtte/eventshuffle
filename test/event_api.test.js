const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const Event = require("../models/event")

const initialEvents = [
  {
    id: 1,
    name: "Bileet",
    dates: ["2021-03-15", "2021-03-14"],
    votes: [
      { date: "2021-03-15", people: ["Matti", "Teppo"] },
      { date: "2021-03-14", people: ["Matti"] },
    ],
  },
  {
    id: 2,
    name: "Juoksukisat",
    dates: ["2021-04-15", "2021-05-14"],
    votes: [
      { date: "2021-04-15", people: ["Matti", "Teppo"] },
      { date: "2021-05-14", people: ["Matti", "Teppo"] },
    ],
  },
]

beforeEach(async () => {
  await Event.deleteMany({})
  let Event1 = new Event(initialEvents[0])
  await Event1.save()
  let Event2 = new Event(initialEvents[1])
  await Event2.save()
})

test("Events are returned as JSON", async () => {
  await api
    .get("/api/v1/event/list")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("There are 2 events", async () => {
  const response = await api.get("/api/v1/event/list")
  expect(response.body.events).toHaveLength(initialEvents.length)
})

test("New event is added succesfully", async () => {
  const newEvent = {
    id: 3,
    name: "Juoksukaljakisat",
    dates: ["2021-04-15", "2021-05-14"],
    votes: [
      { date: "2021-04-15", people: ["Matti", "Teppo"] },
      { date: "2021-05-14", people: ["Matti", "Teppo", "Nipa"] },
    ],
  }

  await api.post("/api/v1/event/").send(newEvent).expect(200)
  const response = await api.get("/api/v1/event/list")
  expect(response.body.events).toHaveLength(initialEvents.length + 1)
})

test("New vote is added succesfully", async () => {
  const newVote = {
    name: "Markoboy",
    votes: ["2021-03-15"],
  }
  await api.post("/api/v1/event/1/vote").send(newVote).expect(200)
  const response = await api.get("/api/v1/event/1")
  expect(response.body.votes).toHaveLength(
    initialEvents[0].votes[0].people.length + 1
  )
})

afterAll(() => {
  mongoose.connection.close()
})
