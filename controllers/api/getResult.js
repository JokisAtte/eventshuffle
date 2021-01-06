const Event = require("../../models/event")
const { getUniqueVoters, arraysEqual } = require("../../utils/index")

const getResult = async (request, response) => {
  const { id } = request.params

  let event = await Event.find({
    id,
  }) //returns a list, take event [0]
  const { votes, name } = event[0]

  let uniqueVoters = []
  let suitableDates = []

  if (votes.length) {
    uniqueVoters = getUniqueVoters(votes)
    for (let i = 0; i < votes.length; i++) {
      if (arraysEqual(votes[i].people, uniqueVoters)) {
        suitableDates.push(votes[i])
      }
    }
  }

  const result = {
    id,
    name,
    suitableDates,
  }

  response.json(result)
}

module.exports = { getResult }
