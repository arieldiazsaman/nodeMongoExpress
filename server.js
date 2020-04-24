const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')

dotEnv.config()

const hostname = process.env.HOSTNAME
const port = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function () {
    console.log('Connected to server')
})

const users = require('./routes/users')
const transtactions = require('./routes/transactions')

const app = express()

app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use('/users', users)
app.use('/transactions', transtactions)

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`)
})