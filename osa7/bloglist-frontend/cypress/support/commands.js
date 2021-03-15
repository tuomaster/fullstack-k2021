// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { wait } from "@testing-library/react"

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(response => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('createUser', (user) => {
  cy.request('POST', 'http://localhost:3003/api/users', user)
})

Cypress.Commands.add('showDetailsOfAllBlogs', () => {
  cy.get('[data-cy=blogs]')
    .find('[data-cy=blog]')
    .find('[data-cy=view-blog-button]')
    .should(function($blogs) {
      expect($blogs).to.have.length(3)

      $blogs.each(function(index) {
        $blogs[index].click()
      })
    })
})

Cypress.Commands.add('initializeLikes', () => {
  cy.get('[data-cy=like-blog-button]').should(function($likeButtons) {
    expect($likeButtons).to.have.length(3)
    $likeButtons.each(function(index) {
      for(let i = 0; i < index; i++) {
        $likeButtons[index].click()
      }
    })
  })
})
