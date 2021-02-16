require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Blog = require('./models/blog')


const tiny = ':method :url :status :res[content-length] - :response-time ms'
morgan.token('data', (request) => {
  return JSON.stringify(request.body)
})
app.use(morgan(`${tiny} :data`))

app.use(cors())
app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!')
})


app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})