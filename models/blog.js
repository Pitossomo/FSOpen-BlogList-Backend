const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

const mongoUrl = config.MONGODB_URL

const Blog = mongoose.model('Blog', blogSchema)
mongoose.connect(mongoUrl)

module.exports = Blog