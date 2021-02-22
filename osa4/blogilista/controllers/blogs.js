const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogToDeleteId = request.params.id
  const blogToDelete = await Blog.findById(blogToDeleteId)
  const user = request.user

  if (!blogToDelete) {
    return response.status(204).end()
  }

  if (blogToDelete.user._id.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized access' })
  }

  await Blog.findByIdAndRemove(blogToDeleteId)
  user.blogs = user.blogs.filter(blog => blog.id !== blogToDeleteId)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedNote.toJSON())
})

module.exports = blogsRouter