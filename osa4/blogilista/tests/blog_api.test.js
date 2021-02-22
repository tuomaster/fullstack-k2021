const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekretaree', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()

  const initialBlogs = helper.initialBlogs.map(blog => {
    return { ...blog, user: savedUser._id  }
  })
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('when db constains blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const blogsAsString = response.body.map(r => helper.stringifyBlog(r))
    expect(blogsAsString).toContain(
      'Type wars Robert C. Martin http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html 2'
    )
  })
})


describe('adding a new blog', () => {
  test('succeeds if valid data is given', async () => {

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretaree' })

    const token = result.body.token

    const newBlog = {
      title: 'Async loops, and why they fail! Part 1',
      author: 'Federico Kereki',
      url: 'https://medium.com/dailyjs/async-loops-and-why-they-fail-part-1-6909a7d134f2',
      likes: 244
    }

    await api
      .post('/api/blogs')
      .auth(token, { type:'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blogsAsString = blogsAtEnd.map(r => helper.stringifyBlog(r))
    expect(blogsAsString).toContain(
      'Async loops, and why they fail! Part 1 Federico Kereki https://medium.com/dailyjs/async-loops-and-why-they-fail-part-1-6909a7d134f2 244'
    )
  })

  test('fails with status code 400 if title is missing', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretaree' })

    const token = result.body.token

    const newBlog = new Blog({
      author: 'Federico Kereki',
      url: 'https://medium.com/dailyjs/async-loops-and-why-they-fail-part-1-6909a7d134f2',
      likes: 244
    })

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if url is missing', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretaree' })

    const token = result.body.token

    const newBlog = new Blog({
      title: 'Async loops, and why they fail! Part 1',
      author: 'Federico Kereki',
      likes: 244
    })

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Async loops, and why they fail! Part 1',
      author: 'Federico Kereki',
      url: 'https://medium.com/dailyjs/async-loops-and-why-they-fail-part-1-6909a7d134f2',
      likes: 244
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('blogs property', () => {
  test('for unique identification is named id', async () => {
    const blogsInDb = await helper.blogsInDb()

    expect(blogsInDb[0].id).toBeDefined()
  })

  test('likes is set to 0 if no value is given', async () => {
    const newBlog = new Blog({
      title: 'Async loops, and why they fail! Part 1',
      author: 'Federico Kereki',
      url: 'https://medium.com/dailyjs/async-loops-and-why-they-fail-part-1-6909a7d134f2',
    })

    const savedBlog = await newBlog.save()
    expect(savedBlog.likes).toBe(0)
  })
})


describe('deletion of a blog', () => {
  test('succeeds if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretaree' })

    const token = result.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const blogsAsString = blogsAtEnd.map(r => helper.stringifyBlog(r))
    expect(blogsAsString).not.toContain(helper.stringifyBlog(blogToDelete))
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '7a3d5da59070081a82a3645'

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekretaree' })

    const token = result.body.token

    await api
      .delete(`/api/blogs/${invalidId}`)
      .auth(token, { type: 'bearer' })
      .expect(400)
  })
})

describe('updating a blog', () => {
  test('succeeds when valid id and data are given', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = blogToUpdate.likes + 1

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    /*
    const blogsAtEnd = await helper.blogsInDb()
    const blogsAsString = blogsAtEnd.map(r => helper.stringifyBlog(r))
    expect(blogsAsString).toContain(helper.stringifyBlog(blogToUpdate))
    */

    const updatedBlog = response.body
    expect(updatedBlog.likes).toBe(blogToUpdate.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})