const express = require('express')
const functions = require('firebase-functions')

const router = require('./router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('*', (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT,PATCH,DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Expose-Headers': 'Defiat-API-Version'
  })

  req.method === 'OPTIONS'
    ? res.send(200)
    : next()
})
app.use('/', router)

const api = functions.https.onRequest(app)

exports.api = api
