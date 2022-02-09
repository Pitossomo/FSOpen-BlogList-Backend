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
  test('return blogs in JSON format', async () => {
    await api.get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/)
  }, 5000)
  
  test('return the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(6)
  })

  test('has the unique identifier named as id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]

    expect(firstBlog.id).toBeDefined()
  })

  // Exercise 4.10
  test('add 1 to the ammount of blogs when posting a new blog', async () => {
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


  })

  // Exercise 4.10
  test.only('save correctly the content of the blog - Ex. 4.10', async () => {
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
  })


  // Exercise 4.11
  test('default value of likes to 0 when it is missing', async () => {
    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com"
    }

    const response = await api.post('/api/blogs').send(blogToPost)

    const blog = response.body
    expect(blog.likes).toBe(0)
  })

  test.todo('Should return 400 error when posting new blog without title or url - Ex. 4.12')
})

afterAll(() => {
  mongoose.connection.close()
})