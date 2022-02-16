const bcrypt = require('bcrypt')
const helper = require('../utils/helper')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  
  const userObjs = helper.initialUsers.map(user => new User(user))
  const userPromises = userObjs.map(async user => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const hashUser = new User({
      name: user.name,
      username: user.username,
      password: passwordHash
    })
    
    await hashUser.save()
  })
  await Promise.all(userPromises)
})

describe('users GET method API', () => {
  test('return users in JSON format', async () => {
    await api
      .get('/api/users').expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('return the correct amount of users', async () => {
    const response = await api.get('/api/users')
    
    expect(response.body).toHaveLength(4)
  })

  test('has the unique identifier named as id', async () => {
    const response = await api.get('/api/users')
    const firstUser = response.body[0]

    expect(firstUser.id).toBeDefined()
  })
})

describe('users POST method API', () => {
  test('user creation succeds with a fresh username', async () => {
    const newUser = {
      username: "pandora",
      name: "Pand Ora",
      password: "pandaHora"
    }

    // POST to the database
    await api
      .post('/api/users').send(newUser)
      .expect(201).expect('Content-Type', /application\/json/)

    // GET from database and check for increased length
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails with proper status code and message if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'pitossomo',
      name: 'Pitossomo II',
      password: 'jogynelsu'
    }

    const result = await api
      .post('/api/users').send(newUser)
      .expect(400).expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('This username is already in use. Please, choose another one')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test.todo('save correctly the user'/*, async () => {
    const blogToPost = {
      title: 'React is fun',
      author: 'Pitossomo',
      url: 'pitoact.com'
    }

    // POST to the database
    await api.post('/api/blogs').send(blogToPost).expect(201)

    // GET from database and check content
    const response = await api.get('/api/blogs')
    const contents = response.body.map(blog => ({
      title: blog.title, 
      author: blog.author, 
      url: blog.url
    }))

    expect(contents).toContainEqual({
      title: 'React is fun',
      author: 'Pitossomo',
      url: 'pitoact.com'
    })
  }*/)

  test('return 400 error when POST new user with missing username', async () => {
    const newUser = {
      name: 'Joaquim José',
      password: "dasilvaxavier"
    }
    
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('A username is required')    
  })
  
  test('return 400 error when POST new user with missing password', async () => {
    const newUser = {
      name: 'Maria Joaquina',
      username: "mariajoaquina"
    }
    
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('A password is required')    
  })

  test('return 400 error when POST new user with username less than 3 chars long', async () => {
    const newUser = {
      name: 'Matt Murdock',
      username: 'DD',
      password: 'elektranachios'
    }
    
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('Username must be at least 3 chars long')    
  })
  
  test('return 400 error when POST new user with password less than 3 chars long', async () => {
    const newUser = {
      name: 'Peter Parker',
      username: 'SpiderMan',
      password: "mj"
    }
    
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('Password must have at least 3 characters')    
  })
})

afterAll(() => {
  mongoose.connection.close()
})