# Eventshuffle
Eventshuffle is an application to help scheduling events with friends.
An event is created by posting a name and suitable dates to the backend, events can be queried from the backend and participants can submit dates suitable for them.
Results of suitable dates can be queried.

# Running Eventshuffle
To run the backend clone the repository and run these commands in command promt:
```
npm install (when running for the first time after cloning)
npm run dev
```

# Endpoints
## List all events
Endpoint: ```/api/v1/event/list```

Request
Method: ```GET```

Response:
```
Body:

{
  "events": [
    {
      "id": 0,
      "name": "Jake's secret party"
    },
    {
      "id": 1,
      "name": "Bowling night"
    },
    {
      "id": 2,
      "name": "Tabletop gaming"
    }
  ]
}
```

## Create an event
Endpoint: ```/api/v1/event```

Request
Method: ```POST```

Body:
```
{
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ]
}
```
Response
Body:
```
{
  "id": 0
}
```
## Show an event
Endpoint: ```/api/v1/event/{id}```

Request
Method: ```GET```

Parameters: ```id (int)```

Response
Body:
```
{
  "id": 0,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy"
      ]
    }
  ]
}
```
## Add votes to an event
Endpoint: ```/api/v1/event/{id}/vote```

Request
Method: ```POST```

Parameters: ```id (int)```

Body:
```
{
  "name": "Dick",
  "votes": [
    "2014-01-01",
    "2014-01-05"
  ]
}
```
Response:
```
{
  "id": 0,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    },
    {
      "date": "2014-01-05",
      "people": [
        "Dick"
      ]
    }
  ]
}
```
## Show the results of an event
Endpoint: ```/api/v1/event/{id}/results``` Responds with dates that are suitable for all participants.
Request
Method: ```GET```

Parameters: ```id (int)```

Response
```
{
  "id": 0,
  "name": "Jake's secret party",
  "suitableDates": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    }
  ]
}
```

# About
Project was created with node v12.13.0
