const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    _id: Number,
    username: String,
    email: String,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
}, {
    timestamps: true
})

const Users = mongoose.model('User', userSchema)

module.exports = Users