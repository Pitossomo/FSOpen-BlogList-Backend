const listHelper = require('../../utils/helper')
const Blog = require('../../models/blog')

const favoriteBlog = listHelper.favoriteBlog

const blogs = listHelper.initialBlogs

describe('favoriteTest', () => {
  test('of a empty blog list is undefined', () => {
    const result = favoriteBlog([])
    expect(result).toEqual(undefined)
  })

  test('of a single-blog blog list is the one blog itself', () => {
    const result = favoriteBlog([blogs[0]])
    expect(result).toEqual({
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    })
  })

  test('of many blogs is the one with most likes', () => {
    const result = favoriteBlog(blogs)
    expect(result).toEqual(
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      }
    )
  })
})
