const low = require("lowdb")
const Filesync = require("lowdb/adapters/FileSync")
const adapter = new Filesync("db.json")
const db = low(adapter)

const generateId = () => {
  const events = db.get("events").value()
  const ids = events.map((event) => event.id)
  let newId
  for (let i = 0; i <= ids.length; i++) {
    if (!ids.includes(i)) {
      newId = i
    }
    if ((i = ids.length)) {
      newId = i
    }
  }
  return newId
}

module.exports = {
  generateId,
}
