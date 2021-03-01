import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const loggedBlogappUser = 'loggedBlogappUser'

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse((loggedUserJSON))
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        loggedBlogappUser, JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (expection) {
      setMessage({
        type: 'error', content: 'wrong username or password'
      })
      setMessageToNull()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(loggedBlogappUser)
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setMessage({
        type: 'success', content: `a new blog "${blogObject.title}" by ${blogObject.author} added`
      })
    } catch (expection) {
      setMessage({
        type: 'error', content: 'failed to add a new blog'
      })
    }
    setMessageToNull()
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      returnedBlog.user = blogObject.user

      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (exception) {
      setMessage({
        type: 'error', content: 'failed to update the blog'
      })
      setMessageToNull()
    }
  }

  const deleteBlog = async id => {
    const blog = blogs.find(blog => blog.id === id)
    if(window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      try {
        await blogService.remove(id)

        setBlogs(blogs.filter(blog => blog.id !== id))

        setMessage({
          type: 'success', content: `blog "${blog.title}" by ${blog.author} removed`
        })
      } catch (exception) {
        setMessage({
          type: 'error', content: 'failed to delete the blog. you can only delete your own blogs'
        })
      }
      setMessageToNull()
    }
  }

  const setMessageToNull = () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} />
        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </div>
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      { user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <Notification message={message} />
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          {blogForm()}
          <div data-cy="blogs">
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App