const express = require('express')

const Transactions = require('../models/transactions')
const Users = require('../models/users')

const router = express.Router()
const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}
router.route('/')
    .get(function (req, res, next) {
        Transactions.find({})
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
            user: req.body.user
        }
        Transactions.create(newTransaction)
            .then(transaction => {
                Users.findById(req.body.user)
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
    .delete(function (req, res, next) {
        Transactions.remove({})
            .then(() => {
                Users.find({})
                    .then(users => {
                        users.forEach(user => {
                            user.transactions = user.transactions.filter(element => {
                                return false
                            })
                            Users.findByIdAndUpdate(user._id, { 'transactions': user.transactions })
                                .then(user => {
                                    console.log("User updated after transaction deletion")
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                        res.end('All transactions deleted')
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })
router.route('/:id')
    .get(function (req, res, next) {
        Transactions.findById(req.params.id)
            .then(transaction => {
                res.json(transaction)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .put(function (req, res, next) {
        const transaction = {
            "description": req.body.description
        }
        Transactions.findByIdAndUpdate(req.params.id, transaction)
            .then(transaction => {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('Transaction updated')
            })
            .catch(err => {
                console.log(err)
            })
    })
    .delete(function (req, res, next) {
        Transactions.findById(req.params.id)
            .then(transaction => {
                Users.findById(transaction.user)
                    .then(user => {
                        Transactions.findByIdAndRemove(req.params.id)
                            .then(() => {
                                user.transactions = user.transactions.filter(element => {
                                    return element != req.params.id
                                })
                                Users.findByIdAndUpdate(user._id, { "transactions": user.transactions })
                                    .then(user => {
                                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                                        res.end('Transaction deleted')
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
                        console.log()
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })
router.route('/:id/changeUser')
    .put(function (req, res, next) {
        Transactions.findById(req.params.id)
            .then(transaction => {
                Users.findById(transaction.user)
                    .then(user1 => {
                        Transactions.findByIdAndUpdate(req.params.id, { "user": req.body.user })
                            .then(transaction => {
                                user1.transactions = user1.transactions.filter(element => {
                                    return element != req.params.id
                                })
                                Users.findByIdAndUpdate(user1._id, { "transactions": user1.transactions })
                                    .then(user1 => {
                                        Users.findById(req.body.user)
                                            .then(user2 => {
                                                user2.transactions.push(req.params.id)
                                                Users.findByIdAndUpdate(user2._id, { "transactions": user2.transactions })
                                                    .then(user2 => {
                                                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                                                        res.end('User Changed')
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