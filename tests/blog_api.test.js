const helper = require('../utils/helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  
  const blogObjs = helper.initialBlogs.map(blog => new Blog(blog))
  const blogPromises = blogObjs.map(blog => blog.save())
  await Promise.all(blogPromises)
})

describe('blog api', () => {
  test('return blogs in JSON format - Ex. 4.8', async () => {
    await api.get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/)
  }, 5000)
  
  test('return the correct amount of blogs - Ex. 4.8', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(6)
  })

  test.todo('Should have its unique identifier named as id - Ex. 4.9')
  test.todo('Should add 1 to the total ammount of blogs when posting a new blog - Ex. 4.10')
  test.todo('Should save correctly the content of the blog to the database - Ex. 4.10')
  test.todo('Should default value of likes to 0 when it is missing - Ex. 4.11')
  test.todo('Should return 400 error when posting new blog without title or url - Ex. 4.12')
})

afterAll(() => {
  mongoose.connection.close()
})