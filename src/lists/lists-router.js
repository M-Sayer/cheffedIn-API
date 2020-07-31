const express = require('express');

const ListsService = require('./lists-service');
const listsRouter = express.Router();
const jwtAuth = require('../middleware/jwt-auth')


//post new list
listsRouter
  .route('/')
  .post(jwtAuth, express.json(), (req, res, next) => {
    const newList = { ...req.body, author_id: req.user.id }

    ListsService.postList(req.app.get('db'), newList)
      .then(list => {
        return res.send(list)
      })
  })

//add auth
//get all recipes for a given list
listsRouter
  .route('/:list_id')
  .get((req, res, next) => {
    ListsService.getRecipesForList(req.app.get('db'), req.params.list_id)
      .then(recipes => {
        if(!recipes) {
          return res.status(404).json({
            error: 'no recipes found'
          })
        }
        return res.send(recipes)
      })
      .catch(next)
  })
  .delete(jwtAuth, (req, res, next) => {
    ListsService.deleteList(req.app.get('db'), req.params.list_id)
      .then(() => res.status(204).end())
      .catch(next)
  })

module.exports = listsRouter;