const Event = require("../models/event")

const eventRouter = require("express").Router()
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

module.exports = eventRouter
