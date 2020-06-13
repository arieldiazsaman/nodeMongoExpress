const express = require('express')

const Transactions = require('../models/transactions')
const Users = require('../models/users')
const asyncMiddleware = require('../utils/asyncMiddleware');
const { patch } = require('./users');

const router = express.Router()

router.route('/')
    .get(asyncMiddleware(async (req, res, next) => {
        const transactions = await Transactions.find({})
        res.json(transactions)
    }))
    .post(asyncMiddleware(async (req, res, next) => {
        const newTransaction = {
            description: req.body.description,
            user: req.body.user
        }
        const transaction = await Transactions.create(newTransaction)
        const user = await Users.findById(req.body.user)
        const userTransactions = user.transactions
        userTransactions.push(transaction._id)
        await Users.findByIdAndUpdate(user._id, {'transactions':userTransactions})
        res.json(transaction)
    }))
    .delete(asyncMiddleware(async (req, res, next) => {
        await Transactions.remove({})
        const users = await Users.find({})
        users.forEach(user => {
            user.transactions = user.transactions.filter(element => {
                return false;
            });
            await Users.findByIdAndUpdate(user._id, { 'transactions': user.transactions });
        })
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('All transactions deleted')
    }))

router.route('/:id')
    .get(asyncMiddleware(async (req, res, next) => {
        const transaction = await Transactions.findById(req.params.id)
        res.json(transaction)
    }))
    .patch(asyncMiddleware(async (req, res, next) => {
        const newTransaction = {
            "description": req.body.description
        }
        await Transactions.findByIdAndUpdate(req.params.id, newTransaction)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Transaction updated')
    }))
    .delete(asyncMiddleware(async (req, res, next) => {
        const transaction = await Transactions.findById(req.params.id)
        const user = await Users.findById(transaction.user)
        await Transactions.findByIdAndRemove(req.params.id)
        user.transactions = user.transactions.filter(element => {
            return element != req.params.id
        })
        await Users.findByIdAndUpdate(user._id, {'transactions':user.transactions})
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Transaction deleted')
    }))

router.route('/:id/changeUser')
    patch(asyncMiddleware(async (req, res, next) => {
        const transaction = await Transactions.findById(req.params.id)
        const user1 = await Users.findById(transaction.user)
        await Transactions.findByIdAndUpdate(req.params.id, {'user':req.body.user})
        user1.transactions = user1.transactions.filter(element => {
            return element != req.params.id
        })
        await Users.findByIdAndUpdate(user1._id, {'transactions':user1.transactions})
        const user2 = await Users.findById(req.body.user)
        user2.transactions.push(req.params.id)
        await Users.findByIdAndUpdate(user2._id, {'transactions':user2.transactions})
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('User Changed')
    }))

module.exports = router