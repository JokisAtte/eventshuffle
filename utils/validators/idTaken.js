const low = require("lowdb")
const Filesync = require("lowdb/adapters/FileSync")
const adapter = new Filesync("db.json")
const db = low(adapter)

const idTaken = (id) => {
  const event = db.get("events").find({ id })
  if (event) {
    return true
  }
  return false
}

module.exports = {
  idTaken,
}
