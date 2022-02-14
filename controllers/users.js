const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch(exception) {
    next(exception)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.find({id: request.params.id})
    response.json(user)
  } catch(exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const user = new User(request.body)

  try {
    const result = await user.save()
    response.status(201).json(result)
  } catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter