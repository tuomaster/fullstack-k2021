
describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Andy Preuninger',
      username: 'apreunin',
      password: 'salainen'
    }
    cy.createUser(user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#login-form')
      .should('contain', 'username')
      .and('contain', 'password')
      .and('contain', 'login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('apreunin')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Andy Preuninger logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('apreunin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Andy Preuninger logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'apreunin', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Just full stack stories')
      cy.get('#author').type('Tester')
      cy.get('#url').type('www.testerblog.net/just-full-stack-stories')
      cy.get('#create-blog-button').click()

      cy.contains('blog "Just full stack stories" by Tester')

      cy.get('[data-cy=blogs]').should('contain', 'Just full stack stories Tester')
    })

    describe('and blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Just full stack stories', author: 'Tester', url: 'www.testerblog.net/just-full-stack-stories' })
      })

      it('blog can be liked', function() {
        cy.get('[data-cy=view-blog-button]').click()

        cy.get('[data-cy=likes]').should('contain', 0).as('likes')
        cy.get('[data-cy=like-blog-button]').click()

        cy.get('@likes').should('contain', 1)


      })

      it('user can delete blogs added by the user', function() {
        cy.get('[data-cy=view-blog-button]').click()
        cy.get('[data-cy=remove-blog-button]').click()

        cy.contains('blog "Just full stack stories" by Tester removed')
        cy.get('[data-cy=blogs').should('not.contain', 'Just full stack stories Tester')
      })

      it('user cannot delete blogs added by others', function() {
        const otherUser = {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'tosisalainen'
        }
        cy.createUser(otherUser)
        cy.login({ username: 'mluukkai', password: 'tosisalainen' })

        cy.get('[data-cy=view-blog-button]').click()
        cy.get('[data-cy=remove-blog-button]').should('not.exist')
      })
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Just full stack stories', author: 'Tester', url: 'www.testerblog.net/just-full-stack-stories' })
        cy.createBlog({ title: 'Vanilla JS vs Strawberry JS', author: 'Tester', url: 'www.testerblog.net/vanilla-js-vs-strawberry-js' })
        cy.createBlog({ title: 'Cypress Punk', author: 'Tester', url: 'www.testerblog.net/cypress-punk' })
      })

      it('blogs are shown in descending order according to their likes', function () {
        cy.showDetailsOfAllBlogs()
        cy.initializeLikes()

        cy.get('[data-cy=blogs]')
          .find('[data-cy=blog]')
          .find('[data-cy=likes]')
          .should(function($likes) {
            expect($likes[0]).contain(2)
            expect($likes[1]).contain(1)
            expect($likes[2]).contain(0)
          })
      })
    })

  })


})