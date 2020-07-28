const express = require('express');

const RecipesService = require('./recipes-service');
const recipesRouter = express.Router();

recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        return res.status(200).json(recipes)
      })
      .catch(next)
  })
  .post(express.json(), (req, res, next) => {

    const newRecipe = {...req.body};

    RecipesService.createRecipe(req.app.get('db'), newRecipe)
      .then(recipe => {
        res.status(201).json(recipe)
      })
      .catch(next)
  })


recipesRouter
  .route('/:recipe_id')
  .get((req, res, next) => {
    RecipesService.getById(req.app.get('db'), req.params.recipe_id)
      .then(recipe => {
        return res.status(200).json(recipe)
      })
      .catch(next)
  })
  .patch(express.json(), (req, res, next) => {
    const newData = { ...req.body};

    RecipesService.updateRecipe(req.app.get('db'), req.params.recipe_id, newData)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .delete((req, res, next) => {
    RecipesService.deleteRecipe(req.app.get('db'), req.params.recipe_id)
      .then(() => res.status(204).end())
      .catch(next)
  })

  
module.exports = recipesRouter;