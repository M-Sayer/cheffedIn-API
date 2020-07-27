const knex = require('knex');

const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe.only('recipes endpoints', () => {
  //create test seed data
  const {
    users, recipes, comments, lists, recipesInLists
  } = helpers.makeFixtures();

  //create knex instance
  let db;

  before('create db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db);
  })

  // use helper function to clean tables
  beforeEach('clean tables', () => helpers.cleanTables(db))

  //destroy connection
  after('destroy connection', () => db.destroy())

  describe('GET /recipes', () => {
    context('given data', () => {
      //insert dummy data
      beforeEach('insert data', () => {
        //use helper function
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      })
      
      it('responds 200 with list of recipes', () => {
        return supertest(app)
          .get('/recipes')
          .expect(200, recipes)

      })
    })
    
  })

  describe('GET /recipes/:recipe_id', () => {
    context('given data', () => {
      beforeEach('insert data', () => {
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      })

      it('responds 200 with specified recipe', () => {
        return supertest(app)
          .get('/recipes/1')
          .expect(200, recipes[0])
      })
    })
  })

  describe('GET /recipes/:recipe_id/comments', () => {
    context('given data', () => {
      beforeEach('insert data', () => {
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      })

      it('responds 200 with all comments for specified recipe', () => {
        const id = 1;
        const findRecipe = comments.filter(comment => comment.recipe_id === id);
        const expected = { ...findRecipe[0], date_modified: null};
        return supertest(app)
          .get(`/recipes/${id}/comments`)
          .expect(200, expected)
      })
    })
  })

})

