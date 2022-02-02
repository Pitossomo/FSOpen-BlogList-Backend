const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const mongoUrl = config.MONGODB_URL

const Blog = mongoose.model('Blog', blogSchema)
mongoose.connect(mongoUrl)

module.exports = Blog