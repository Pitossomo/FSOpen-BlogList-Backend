const mongoose = require('mongoose')
const config = require('../utils/config')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
})

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.password
  }
})

const mongoUrl = config.MONGODB_URL

const User = mongoose.model('User', userSchema)
mongoose.connect(mongoUrl)

module.exports = User