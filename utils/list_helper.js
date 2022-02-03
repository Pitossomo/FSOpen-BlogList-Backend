const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => blog.likes + sum
  return blogs.reduce(reducer, 0)
}

const favoriteTest = (blogs) => {
  const reducer = (favBlog, blog) => {
    const mostLikes = favBlog?.likes || 0

    return (blog.likes > mostLikes ? blog : favBlog)
  }

  return blogs.reduce(reducer, undefined)
}


module.exports = { dummy, totalLikes, favoriteTest }