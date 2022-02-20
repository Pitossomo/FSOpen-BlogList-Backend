const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog(request.body)
  blog.user = user._id  // Reference creator user in blog data

  // Save blog
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

  // Update user to reference created blog
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save() 
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body

  const result = await Blog.findByIdAndUpdate(id, blog)
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  const user = await User.findById(decodedToken.id)
  
  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'user not authorized'})
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(200).send()
})

module.exports = blogsRouter