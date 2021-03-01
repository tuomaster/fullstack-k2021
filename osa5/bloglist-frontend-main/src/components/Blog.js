import React, { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [viewAll, setViewAll] = useState(false)

  const toggleView = () => {
    setViewAll(!viewAll)
  }

  const updateLikes = () => {
    const editedBlog = blog
    editedBlog.user._id = blog.user.id
    //delete editedBlog.user.id
    editedBlog.likes += 1

    updateBlog(blog.id, editedBlog)
  }

  const removeBlog = () => {
    deleteBlog(blog.id)
  }

  const buttonLabel = () => {
    if(viewAll) {
      return 'hide'
    }
    return 'view'
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButtonStyle = {
    backgroundColor: 'blue'
  }

  return(
    <div style={blogStyle} data-cy="blog">
      <div onClick={toggleView}>
        {blog.title} {blog.author} <button onClick={toggleView} data-cy="view-blog-button">{buttonLabel()}</button>
      </div>
      { viewAll &&
        <div className="blogDetails">
          <div>
            {blog.url}
          </div>
          <div data-cy="likes">
            {blog.likes} <button onClick={updateLikes} data-cy="like-blog-button">like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          { user.username === blog.user.username &&
            <button style={removeButtonStyle} onClick={removeBlog} data-cy="remove-blog-button">remove</button>
          }
        </div>
      }

    </div>
  )
}

export default Blog