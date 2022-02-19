const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const users = await User.find({})
  const user = users[0]

  // Reference creator user in blog data
  blog.user = user._id

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
  const blogId = request.params.id

  await Blog.findByIdAndDelete(blogId)
  response.status(200).send()
})

module.exports = blogsRouter