const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  /*
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  */
  request.user = await User.findById(decodedToken.id)

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) =>  {
  logger.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send(({ error: 'malformatted id' }))
  }
  if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })

  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}