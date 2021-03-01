import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'


test('<BlogForm /> calls onSubmit with correct input information', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing components with jest' }
  })
  fireEvent.change(author, {
    target: { value: 'Tester' }
  })
  fireEvent.change(url, {
    target: { value: 'www.testerblog.net/testing-components-with-jest' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Testing components with jest')
  expect(createBlog.mock.calls[0][0].author).toBe('Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testerblog.net/testing-components-with-jest')
})