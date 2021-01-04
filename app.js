const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware.js")
const eventsRouter = require("./controllers/events")
const logger = require("./utils/logger")

const mongoose = require("mongoose")

//This is far from good practice
mongodb_uri =
  "mongodb+srv://Atte:OttakaaToihinFuturice@eventsuffle.ynqqq.mongodb.net/eventsuffle?retryWrites=true&w=majority"

mongoose
  .connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message)
  })

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

app.use(middleware.requestLogger)

app.use("/api/v1", eventsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
