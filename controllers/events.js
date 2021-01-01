const { response } = require('express')
const low = require('lowdb')
const Filesync = require('lowdb/adapters/FileSync')
const eventRouter = require('express').Router()

const adapter = new Filesync('db.json')
const db = low(adapter)

eventRouter.get('/event/list', (request, response) => {
    const events = db.get('events').value()
    response.json(events)
})

eventRouter.get('/event/:id', (request, response) => {
    const { id } = request.params
    const event = db.get('events')
                    .find({ id:id })
                    .value()
    response.json(event)
})

eventRouter.post('/event', (request, response) => {
    const { body } = request
    if(!nameTaken(body.name)){
        const id = generateId()
        const newEvent = {
            "id" : id,
            "name": body.name,
            "dates": body.dates,
            "votes": []
        }
        db.get('events')
        .push(newEvent)
        .write()
        response.status(201).json({ "id":id })
    } else {
        response.status(400).send("Error: Event name already in use")
    }
})

const generateId = () => {
    const events = db.get('events').value()
    const ids = events.map(event => event.id)
    let newId;
    for(let i = 0; i <= ids.length; i++){
        if(!ids.includes(i.toString())){
            newId = i
        }
        if(i = ids.length){
            newId = i
        }
    }
    console.log(newId)
    return newId.toString()
}

const nameTaken = (name) => {
    const events = db.get('events').value()
    const names = events.map(event => event.name)
    if(names.includes(name)){
        return true
    }
    return false
}

module.exports = eventRouter 