const Event = require("../../models/event")
const { getUniqueVoters, arraysEqual } = require("../../utils/index")
const _ = require("lodash")

const getResult = async (request, response) => {
  const { id } = request.params

  await Event.find({
    id,
  }).then((event) => {
    const { votes, name } = event[0] //returns a list, take event [0]

    let uniqueVoters = []
    let suitableDates = []

    if (votes.length) {
      uniqueVoters = _.sortedUniq(votes)
      for (let i = 0; i < votes.length; i++) {
        if (_.isEqual(votes[i].people, uniqueVoters)) {
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
  })
}

module.exports = { getResult }
