require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

const eventsRouter = require("./controllers/events")

const { middleware, logger } = require("./utils/index")
const { MONGODB_URI, PORT } = require("./utils/config")
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
app.use("/api/v1/event", eventsRouter)
app.use(middleware.unknownEndpoint)

module.exports = app
