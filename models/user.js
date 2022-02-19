const mongoose = require('mongoose')
const config = require('../utils/config')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required'],
    minlength: [3, 'Username must be at least 3 chars long'] 
  },
  password: { type: String, required: true },
  name: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
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