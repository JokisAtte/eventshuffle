const low = require("lowdb")
const Filesync = require("lowdb/adapters/FileSync")
const adapter = new Filesync("db.json")
const db = low(adapter)

const nameTaken = (name) => {
  const event = db.get("events").find({ name }).value()
  if (event) {
    return true
  }
  return false
}

module.exports = {
  nameTaken,
}
