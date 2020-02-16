const admin = require('firebase-admin')

const config = require('./config.json')

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: 'https://defiat-492ca.firebaseio.com'
})

module.exports = admin
