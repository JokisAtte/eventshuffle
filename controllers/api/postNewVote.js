const Event = require("../../models/event")

const postNewVote = async (request, response) => {
  const { id } = request.params
  const { name: voterName, votes: newVotes } = request.body

  const event = Event.find({ id })
  console.log(event)
  //const event = events[0] //returns a list of one event, destruct event
  const { votes } = event

  for (let i = 0; i < votes.length; i++) {
    if (
      newVotes.includes(votes[i].date) &&
      !votes[i].people.includes(voterName)
    ) {
      votes[i].people.push(voterName)
    }
  }
  const savedEvent = await event.save()
  response.json({ savedEvent })
}

module.exports = { postNewVote }
