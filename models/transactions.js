const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = Schema({
    description: String,
    user: { 
        type: Number, ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const Transactions = mongoose.model('Transaction', transactionSchema)

module.exports = Transactions