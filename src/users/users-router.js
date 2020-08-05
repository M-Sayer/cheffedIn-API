const express = require('express')

const UsersService = require('./users-service')
const usersRouter = express.Router()
const jwtAuth = require('../middleware/jwt-auth')

//add auth
usersRouter
  .route('/:user_id/lists')
  .get(jwtAuth, (req, res, next) => {
    //get all lists for given user
    UsersService.getUserLists(req.app.get('db'), req.params.user_id)
      .then(lists => {
        if(!lists) {
          return res.status(404).json({error: 'no lists found'})
        }
        res.send(lists)
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
        res.send(recipes)
      })
      .catch(next)
  })


module.exports = usersRouter;