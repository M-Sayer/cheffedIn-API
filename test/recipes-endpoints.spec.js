const knex = require('knex');

const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('recipes endpoints', () => {
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
    });
    app.set('db', db);
  });

  // use helper function to clean tables
  beforeEach('clean tables', () => helpers.cleanTables(db));

  //destroy connection
  after('destroy connection', () => db.destroy());

  describe('GET /recipes', () => {
    context('given data', () => {
      //insert dummy data
      beforeEach('insert data', () => {
        //use helper function
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      });
      
      it('responds 200 with list of recipes', () => {
        const expectedRecipes = helpers.makeExpectedRecipes(users, recipes);

        return supertest(app)
          .get('/recipes')
          .expect(200, expectedRecipes);

      });
    });
    
  });

  describe('GET /recipes/:recipe_id', () => {
    context('given data', () => {
      beforeEach('insert data', () => {
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      });

      it('responds 200 with specified recipe', () => {
        const expectedRecipes = helpers.makeExpectedRecipes(users, recipes);
        return supertest(app)
          .get('/recipes/1')
          .expect(200, expectedRecipes[0]);
      });
    });
  });

  describe('GET /recipes/:recipe_id/comments', () => {
    context('given data', () => {
      beforeEach('insert data', () => {
        return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
      });

      it('responds 200 with all comments for specified recipe', () => {
        const id = 1;
        const expectedComments = helpers.makeExpectedComments(id, comments, users);
        
        return supertest(app)
          .get(`/recipes/${id}/comments`)
          .expect(200, expectedComments);
      });
    });
  });

  describe('DELETE /recipes/:recipe_id', () => {
    beforeEach('insert data', () => {
      return helpers.seedTables(db, users, recipes, comments, lists, recipesInLists);
    });

    it('deletes recipe, responds 204', () => {
      const recipe = recipes.find(recipe => recipe.id === 1);
      const user = users.find(user => user.id === recipe.author_id);
      const expected = helpers.makeExpectedRecipes(users, recipes).filter(recipe => recipe.id !== 1);
      

      return supertest(app)
        .delete('/recipes/1')
        .set('Authorization', helpers.makeAuthHeaders(user))
        .expect(204)
        .then(() => {
          return supertest(app)
            .get('/recipes')
            .expect(expected);
        });
    });
  });

});

