const _ = require('lodash')

const dummy = (blogs) => {
  blogs.map(blog => blog)
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const result = {
    title: '',
    author: '',
    likes: -Infinity
  }

  blogs.forEach(blog => {
    if (blog.likes > result.likes) {
      result.title = blog.title,
      result.author = blog.author,
      result.likes = blog.likes
    }
  })
  return blogs.length === 0
    ? null
    : result
}

const mostBlogs = (blogs) => {
  const result = {
    author: '',
    blogs: -Infinity
  }

  const blogsPerAuthor = _.countBy(blogs, 'author')

  _.forEach(blogsPerAuthor, (blogs, author) => {
    if (blogs > result.blogs) {
      result.author = author,
      result.blogs = blogs
    }
  })

  return blogs.length === 0
    ? null
    : result
}

const mostLikes = (blogs) => {
  const result = {
    author: '',
    likes: -Infinity
  }

  const authorsBlogs = _.groupBy(blogs, 'author')

  _.forEach(authorsBlogs, (blogs, author) => {
    const authorsLikes = totalLikes(blogs)

    if (authorsLikes > result.likes) {
      result.author = author
      result.likes = authorsLikes
    }
  })

  return blogs.length === 0
    ? null
    : result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}