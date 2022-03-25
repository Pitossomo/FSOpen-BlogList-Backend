const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.find({ id: request.params.id }).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'A password is required' })
  }
  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Password must have at least 3 characters' })
  }
  const users = await User.find({})
  const usernames = users.map((u) => u.username)
  if (usernames.includes(username)) {
    return response
      .status(400)
      .json({
        error: 'This username is already in use. Please, choose another one',
      })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    password: passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
