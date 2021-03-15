import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component
  let mockHandler

  beforeEach(() => {
    const user = {
      username: 'apreun',
      name: 'Andy Preuninger'
    }

    const blog = {
      title: 'Testing components with jest',
      author: 'Tester',
      url: 'www.testerblog.net/-testing-components-with-jest',
      likes: 911,
      user
    }

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler} />
    )
  })

  test('renders title and author of the blog', () => {
    expect(component.container).toHaveTextContent(
      'Testing components with jest Tester'
    )

    expect(component.container).not.toHaveTextContent(
      'www.testerblog.net/-testing-components-with-jest'
    )
    expect(component.container).not.toHaveTextContent(
      '911'
    )
  })

  test('renders all the blogs details when the view-button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blogDetails')
    expect(div).toBeDefined()

    expect(component.container).toHaveTextContent(
      'www.testerblog.net/-testing-components-with-jest'
    )

    expect(component.container).toHaveTextContent(
      '911'
    )
  })

  test('clicking the like-button calls event handler', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})