const express = require('express')

const Users = require('../models/users')
const Transactions = require('../models/transactions')

const router = express.Router()

router.route('/')
    .get(function (req, res, next) {
        Users.find({})
            .then(users => {
                res.json(users)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post(function (req, res, next) {
        const newUser = {
            "_id": req.body.id,
            "username": req.body.username,
            "email": req.body.email
        }
        Users.create(newUser)
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .delete(function (req, res, next) {
        Users.remove({})
            .then(() => {
                Transactions.remove({})
                    .then(transaction => {
                        console.log("Transactions deleted after users")
                    })
                    .catch(err => {
                        console.log(err)
                    })
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('All users deleted')
            })
            .catch(err => {
                console.log(err)
            })
    })
router.route('/:id')
    .get(function (req, res, next) {
        Users.findById(req.params.id)
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .put(function (req, res, next) {
        const user = {
            "username": req.body.username,
            "email": req.body.email
        }
        Users.findByIdAndUpdate(req.params.id, user)
            .then(user => {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('User updated')
            })
            .catch(err => {
                console.log(err)
            })
    })
    .delete(function (req, res, next) {
        Users.findByIdAndRemove(req.params.id)
            .then(() => {
                Transactions.find({ "user": req.params.id })
                    .then(transactions => {
                        transactions.forEach(element => {
                            console.log(element._id)
                            Transactions.findByIdAndRemove(element._id)
                                .then(transaction => {
                                    console.log("deleted")
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('User deleted')
            })
            .catch(err => {
                console.log(err)
            })
    })
router.route("/:id/transactions")
    .get(function (req, res, next) {
        Transactions.find({ "user": req.params.id })
            .then(transactions => {
                res.json(transactions)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post(function (req, res, next) {
        const newTransaction = {
            description: req.body.description,
            user: req.params.id
        }
        Transactions.create(newTransaction)
            .then(transaction => {
                Users.findById(req.params.id)
                    .then(user => {
                        transactions = user.transactions
                        transactions.push(transaction._id)
                        Users.findByIdAndUpdate(user._id, { 'transactions': transactions })
                            .then(user => {
                                res.json(transaction)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })

module.exports = router