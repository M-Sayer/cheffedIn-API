const express = require('express');

const RecipesService = require('./recipes-service');
const CommentsService = require('../comments/comments-service')
const recipesRouter = express.Router();
const jwtAuth = require('../middleware/jwt-auth');
const userAuth = require('../middleware/recipes-user-auth')

recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        let serializedRecipes = recipes.map(recipe => {
          return RecipesService.serializeRecipe(recipe)
        });
        return res.status(200).json(serializedRecipes)
      })
      .catch(next)
  })
  .post(jwtAuth, express.json(), (req, res, next) => {
    const newRecipe = { ...req.body }

    for (const [key, value] of Object.entries(newRecipe))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      })

    newRecipe.author_id = req.user.id

    RecipesService.createRecipe(req.app.get('db'), newRecipe)
      .then(recipe => {
        res.status(201).json(RecipesService.serializeRecipe(recipe))
      })
      .catch(next)
  })

recipesRouter
  .route('/:recipe_id')
  .get((req, res, next) => {
    RecipesService.getById(req.app.get('db'), req.params.recipe_id)
      .then(recipe => {
        return res.status(200).json(RecipesService.serializeRecipe(recipe))
      })
      .catch(next)
  })
  .patch(jwtAuth, userAuth, express.json(), (req, res, next) => {
    const newData = { ...req.body};

    RecipesService.updateRecipe(req.app.get('db'), req.params.recipe_id, newData)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .delete(jwtAuth, userAuth, (req, res, next) => {
    RecipesService.deleteRecipe(req.app.get('db'), req.params.recipe_id)
      .then(() => res.status(204).end())
      .catch(next)
  })

recipesRouter
  .route('/:recipe_id/comments')
  .get((req, res, next) => {
    RecipesService.getCommentsForRecipe(req.app.get('db'), req.params.recipe_id)
      .then(comments => {
        let serializedComments = comments.map(comment => CommentsService.serializeComment(comment)) 
        res.send(serializedComments)
      })
      .catch(next)
  })


module.exports = recipesRouter;