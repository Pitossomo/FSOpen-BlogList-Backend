const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
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