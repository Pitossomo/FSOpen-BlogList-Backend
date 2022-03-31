const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const populateOptions = {
  username: 1,
  name: 1,
  id: 1,
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', populateOptions)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)
  blog.user = user._id // Reference creator user in blog data

  // Save blog
  const savedBlog = await blog.save()
  savedBlog.user = user
  response.status(201).json(savedBlog)

  // Update user to reference created blog
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
})

blogsRouter.post('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body
  blog.user = blog.user._id // Reference creator user in blog data

  const user = request.user

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'user not authorized' })
  }

  const result = await Blog.findByIdAndUpdate(id, blog)

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  const user = request.user

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'user not authorized' })
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(200).send()
})

// like operation
blogsRouter.post('/:id/like', async (request, response) => {
  const id = request.params.id

  // mongoose syntax for increasing 1
  const result = await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } })

  response.status(201).json(result)
})

blogsRouter.post('/:id/comment', async (request, response) => {
  const id = request.params.id
  const comment = request.body.comment

  // mongoose syntax for pushing one element to the comments array
  const result = await Blog.findByIdAndUpdate(id, {
    $push: { comments: comment },
  })

  response.status(201).json(result)
})

module.exports = blogsRouter
