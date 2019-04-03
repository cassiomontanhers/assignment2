const http = require('http');
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  const twiml = new MessagingResponse()

  twiml.message('test response')

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

module.exports = app
