const Event = require("../../models/event")

const postNewVote = async (request, response) => {
  const { id } = request.params
  const { name: voterName, votes: newVotes } = request.body

  await Event.find({ id }).then((event) => {
    event = event[0] //returns a list of one event, take event[0]
    const { votes } = event

    for (let i = 0; i < votes.length; i++) {
      if (
        newVotes.includes(votes[i].date) &&
        !votes[i].people.includes(voterName)
      ) {
        votes[i].people.push(voterName)
      }
    }
    event.save()
    response.json(event)
  })
}

module.exports = { postNewVote }
