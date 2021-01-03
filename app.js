const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware.js")
const eventsRouter = require("./controllers/events")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

app.use(middleware.requestLogger)

app.use("/api/v1", eventsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
