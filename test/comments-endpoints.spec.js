const knex = require('knex');

const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('comments endpoints', () => {
  //create test seed data
  const {
    users, recipes, comments, lists, recipesInLists
  } = helpers.makeFixtures();

  //create knex instance
  let db;

  before('create db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db);
  })

  // use helper function to clean tables
  beforeEach('clean tables', () => helpers.cleanTables(db))

  //destroy connection
  after('destroy connection', () => db.destroy())

  context('given data', () => {
    beforeEach('insert data', () => {
      return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists)
    })

    describe('POST /comments', () => {
      it('posts comment, responds 201 with new comment', () => {
        const newComment = {
          message: "test"
        }
        
        return supertest(app)
          .post('/comments')
          .set('Authorization', helpers.makeAuthHeaders(users[0]))
          .send(newComment)
          .expect(201)
          .expect(res => {
            expect(res.body.message).to.eql(newComment.message)
          })
      })
    })

    describe('DELETE /comments/:comment_id', () => {
      it('deletes comment, responds 204', () => {
        const commentToDelete = comments.find(comment => comment.id === 1)
        const user = users.find(user => user.id === commentToDelete.author_id)
        const recipe = recipes.find(recipe => recipe.id === commentToDelete.recipe_id)
        const expectedComments = comments.filter(comment => (comment.recipe_id === recipe.id && comment.id !== commentToDelete.id))

        return supertest(app)
          .delete('/comments/1')
          .set('Authorization', helpers.makeAuthHeaders(user))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/recipes/${recipe.id}/comments`)
              .expect(expectedComments)
          })
      })
    })

    describe('PATCH /comments/:comment_id', () => {
      it('updates comment, responds 204', () => {
        const testComment = comments[0]
        const testUser = users.find(user => user.id === testComment.author_id)
        const updatedComment = { ...testComment, message: 'updated'}
        const recipe = recipes.find(recipe => recipe.id === testComment.recipe_id)
        const expected = helpers.makeExpectedComments(recipe.id, [updatedComment], users).filter(comment => comment.id === recipe.id)

        return supertest(app)
          .patch(`/comments/${testComment.id}`)
          .set('Authorization', helpers.makeAuthHeaders(testUser))
          .send(updatedComment)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/recipes/${recipe.id}/comments`)
              .expect(expected)
          })
      })
    })

  })
  
})