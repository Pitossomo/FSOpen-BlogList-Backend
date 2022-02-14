const helper = require('../utils/helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  
  const userObjs = helper.initialUsers.map(user => new User(user))
  const userPromises = userObjs.map(user => user.save())
  await Promise.all(userPromises)
})

describe('users GET method API', () => {
  test('return users in JSON format', async () => {
    await api.get('/api/users').expect(200)
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
  test.todo('add 1 to the ammount of users when creating a new user'/*, async () => {
    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com"
    }

    // POST to the database
    await api.post('/api/blogs').send(blogToPost).expect(201)

    // GET from database and check for increased length
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(7)
  }*/)

  test.todo('save correctly the content of the blog - Ex. 4.10'/*, async () => {
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

  test.todo('default value of likes to 0 when it is missing'/*, async () => {
    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com"
    }

    const response = await api.post('/api/blogs').send(blogToPost)
    const blog = response.body
    expect(blog.likes).toBe(0)
  }*/)

  test.todo('return 400 error when POST new blog with missing title'/*, async () => {
    const blogToPost = {
      author: "Pitossomo",
      url: "pitoact.com"
    }
    
    await api.post('/api/blogs').send(blogToPost).expect(400)
  }*/)

  test.todo('return 400 error when POST new blog with missing url'/*, async () => {
    const blogToPost = {
      title: 'React is fun',
      author: "Pitossomo"
    }
    
    await api.post('/api/blogs').send(blogToPost).expect(400)
  }*/)
})

afterAll(() => {
  mongoose.connection.close()
})