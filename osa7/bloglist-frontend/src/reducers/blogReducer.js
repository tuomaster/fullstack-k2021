import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch ({
      type: 'INIT_BLOGS',
      data: blogs
    }
    )
  }
}

export const createBlog = (blogObject) => {
  return async dispatch => {
    const returnedBlog = await blogService.create(blogObject)
    dispatch ({
      type: 'CREATE_BLOG',
      data: returnedBlog
    })
  }
}

export const updateLikes = (id, blogObject) => {
  return async dispatch => {
    const returnedBlog = await blogService.update(id, blogObject)
    returnedBlog.user = blogObject.user
    dispatch ({
      type: 'UPDATE_BLOG',
      data: returnedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'CREATE_BLOG':
      return [...state, action.data]
    case 'UPDATE_BLOG': {
      const id = action.data.id
      return state.map(blog => blog.id !== id ? blog : action.data)
    }
    case 'DELETE_BLOG': {
      const id = action.data
      return state.filter(blog => blog.id !== id)
    }
    default:
      return state
  }
}

export default blogReducer