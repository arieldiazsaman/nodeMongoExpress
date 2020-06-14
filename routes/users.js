const express = require('express')

const Users = require('../models/users')
const Transactions = require('../models/transactions')
const asyncMiddleware = require('../utils/asyncMiddleware');

const router = express.Router()

router.route('/')
    .get(asyncMiddleware(async (req, res, next) => {
        const users = await Users.find({})
        res.json(users)
    }))
    .post(asyncMiddleware(async (req, res, next) => {
        const newUser = {
            "_id": req.body.id,
            "username": req.body.username,
            "email": req.body.email
        }
        const user = await Users.create(newUser)
        res.json(user)
    }))
    .delete(asyncMiddleware(async (req, res, next) => {
        await Users.remove({})
        await Transactions.remove({})
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('All users deleted')
    }))

router.route('/:id')
    .get(asyncMiddleware(async (req, res, next) => {
        const user = await Users.findById(req.params.id)
        res.json(user)
    }))
    .patch(asyncMiddleware(async (req, res, next) => {
        const user = {
            "username": req.body.username,
            "email": req.body.email
        }
        await Users.findByIdAndUpdate(req.params.id, user)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('User updated')
    }))
    .delete(asyncMiddleware(async (req, res, next) => {
        await Users.findByIdAndRemove(req.params.id)
        const transactions = await Transactions.find({"user":req.params.id})
        for(let i = 0; i < transactions.length; i++){
            await Transactions.findByIdAndRemove(transactions[i]._id)
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('User deleted')
    }))

router.route('/:id/transactions')
    .get(asyncMiddleware(async (req, res, next) => {
        const transactions = await Transactions.find({"user":req.params.id})
        res.json(transactions)
    }))
    .post(asyncMiddleware(async (req, res, next) => {
        const newTransaction = {
            description: req.body.description,
            user: req.params.id
        }
        const transaction = await Transactions.create(newTransaction)
        const user = await Users.findById(req.params.id)
        const userTransactions = user.transactions
        userTransactions.push(transaction._id)
        await Users.findByIdAndUpdate(user._id, {'transactions': userTransactions})
        res.json(transaction)
    }))

module.exports = router