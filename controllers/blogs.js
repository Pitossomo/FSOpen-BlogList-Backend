const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch(exception) {
    if (exception.name === 'ValidationError') {
      response.status(400).send({error: 'malformatted id'})
    }
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const blog = request.body

  console.log(blog)

  try {
    const result = await Blog.findByIdAndUpdate(id, blog)
    response.status(201).json(result)
  } catch(exception) {
    if (exception.name === 'ValidationError') {
      response.status(400).send({error: 'malformatted id'})
    }
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id

  try {
    await Blog.findByIdAndDelete(blogId)
    response.status(200).send()
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter