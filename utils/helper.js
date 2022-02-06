const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

// always return one
const dummy = (blogs) => 1

// return the sum of likes in all blogs
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => blog.likes + sum
  return blogs.reduce(reducer, 0)
}

// return the blog with most likes
const favoriteBlog = (blogs) => {
  const reducer = (favBlog, blog) => {
    let mostLikes = favBlog?.likes || 0

    return (blog.likes > mostLikes ? blog : favBlog)
  }

  return blogs.reduce(reducer, undefined)
}

// return the author with most blogs
const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return undefined
  
  /* Reduce the blog list to 2 variables:
    - a dictionary (blogCount) where:
      * key is the author name, and
      * value is the number of blogs for that author; 
    - the name of the biggest author (bigAuthor - the one with most blogs)
  */
  const reducer = ([blogCount, bigAuthor], blog) => {
    const author = blog.author
    blogCount[author] = 1 + (blogCount[author] ?? 0)
    if ( !bigAuthor || (
      author!==bigAuthor 
      && blogCount[author] > blogCount[bigAuthor]
      )
    ) {
      bigAuthor = author
    }
    return [blogCount, bigAuthor] 
  }

  const [mostBlogs, bigAuthor] = blogs.reduce(reducer, [{}, undefined])
  
  return {
    author: bigAuthor,
    blogs: mostBlogs[bigAuthor]
  }
}
  
// return the author with most likes across all blogs
const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return undefined

  /* Reduce the blog list to 2 variables:
    - a dictionary (numOfLikes) where:
      * keys are authors' names, and
      * values are their totalLikes; and
    - the name of the author with most likes (favAuthor)
  */
 const likeReducer = ([numOfLikes, favAuthor], blog) => {
    numOfLikes[blog.author] = blog.likes + ( numOfLikes[blog.author] ?? 0 )
    if ( !favAuthor || (
        blog.author !== favAuthor 
        && numOfLikes[blog.author] > numOfLikes[favAuthor]
        )
     ) {
        favAuthor = blog.author
    }  
    return [numOfLikes, favAuthor]
  }
  const [numOfLikes, favAuthor] = blogs.reduce(likeReducer, [{}, undefined])
  
  return {
    author: favAuthor,
    likes: numOfLikes[favAuthor]
  }
}

module.exports = { 
  initialBlogs,
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}