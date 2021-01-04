const generateId = () => {
  const max = 100
  return Math.floor(Math.random() * Math.floor(max))
}

module.exports = {
  generateId,
}
