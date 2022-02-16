const listHelper = require('../../utils/helper')
const Blog = require('../../models/blog')

const mostBlogs = listHelper.mostBlogs

const blogs = listHelper.initialBlogs

describe('mostBlogs', () => {
  test('of a empty blog list is undefined', () => {
    const result = mostBlogs([]) 
    expect(result).toBe(undefined)
  })

  test('of only one blog is the author of this one blog', () => {
    const result = mostBlogs([
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      }  
    ])
    expect(result).toEqual({
      author: "Michael Chan",
      blogs: 1
    })
  })

  test('of a blog list is calculated right', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})
