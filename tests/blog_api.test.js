const helper = require('../utils/test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { set } = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await helper.resetUsers()
  const users = await helper.usersInDb()
  // console.log(users)

  await helper.resetBlogs(users)
  // const blogs = await helper.blogsInDb()
  // console.log(blogs)
})

describe('blogs GET method API', () => {
  test('return blogs in JSON format', async () => {
    await api.get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('return the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('has the unique identifier named as id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]

    expect(firstBlog.id).toBeDefined()
  })
})

const getTokenFromLogin = async () => {
  // Define creator user
  const user = {
    username: 'pitossomo',
    password: 'pitossomo'
  }
  
  // Login
  const loginResponse = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  return loginResponse.body.token
}

describe('blogs POST method API', () => {
  test('add 1 to the ammount of blogs save content correctly when posting new blog', async () => {
    const token = await getTokenFromLogin()

    // Create blog
    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com",
    }

    // POST to the database
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToPost)
      .expect(201)

    // GET from database and check for increased length
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(7)

    // Check created blog content
    const contents = blogs.map(blog => ({
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

  test('default value of likes to 0 when it is missing', async () => {
    const token = await getTokenFromLogin()

    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToPost)

    const blog = response.body
    expect(blog.likes).toBe(0)
  })

  test('return 400 error when POST new blog with missing title', async () => {
    const token = await getTokenFromLogin()
    
    const blogToPost = {
      author: "Pitossomo",
      url: "pitoact.com"
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToPost)
      .expect(400)
  })

  test('return 400 error when POST new blog with missing url', async () => {
    const token = await getTokenFromLogin()
    
    const blogToPost = {
      title: 'React is fun',
      author: "Pitossomo"
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToPost)
      .expect(400)
  })

  test('return 401 error when POST new blog with invalid token', async () => {
    const token = 'invalidToken'
    
    const blogToPost = {
      title: "React is fun",
      author: "Pitossomo",
      url: "pitoact.com",
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToPost)
      .expect(401)
  })
})

describe("blog api DELETE method", () => {
  test.todo("removes one blog from list")
  test.todo("correctly removes blog with passed id from list")
})

describe("blog api PUT method", () => {
  test.todo("correctly update blog with passed id")
  test.todo("check for valid parameters")
})

afterAll(() => {
  mongoose.connection.close()
})