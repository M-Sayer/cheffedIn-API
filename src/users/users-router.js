const express = require('express')

const UsersService = require('./users-service')
const usersRouter = express.Router()
const jwtAuth = require('../middleware/jwt-auth')
const ListsService = require('../lists/lists-service')
const RecipesService = require('../recipes/recipes-service')


usersRouter
  .route('/:user_id/lists')
  .get(jwtAuth, (req, res, next) => {
    //get all lists for given user
    UsersService.getUserLists(req.app.get('db'), req.params.user_id)
      .then(lists => {
        if(!lists) {
          return res.status(404).json({error: 'no lists found'})
        }
        let serializedLists = lists.map(list => ListsService.serializeList(list)
        )

        res.send(serializedLists)
      })
      .catch(next)
  })

usersRouter
  .route('/:user_id/recipes')
  .get(jwtAuth, (req, res, next) => {
    UsersService.getUserRecipes(req.app.get('db'), req.params.user_id)
      .then(recipes => {
        if(!recipes) {
          return res.status(404).json({ error: 'no recipes found'})
        }
        let serializedRecipes = recipes.map(recipe => RecipesService.serializeRecipe(recipe)
        )

        res.send(serializedRecipes)
      })
      .catch(next)
  })


module.exports = usersRouter;