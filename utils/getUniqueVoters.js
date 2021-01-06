/**
 *
 * @param {array} votes Array containing vote objects
 */
const getUniqueVoters = (votes) => {
  let allVotes = []
  for (let date of votes) {
    allVotes.push(...date.people)
  }
  return allVotes.filter(unique)
}

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

module.exports = {
  getUniqueVoters,
}
