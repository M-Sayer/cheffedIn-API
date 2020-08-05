const express = require('express');

const ListsService = require('./lists-service');
const listsRouter = express.Router();
const jwtAuth = require('../middleware/jwt-auth')
const userAuth = require('../middleware/lists-user-auth')


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

listsRouter
  .route('/:list_id')
  .get(jwtAuth, userAuth, (req, res, next) => {
    if(req.list) {
      return res.send(req.list)
    } else {
      return res.status(500).json({ error: 'something went wrong, please try again later'})
    }
  })
  .delete(jwtAuth, userAuth, (req, res, next) => {
    ListsService.deleteList(req.app.get('db'), req.params.list_id)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .patch(jwtAuth, userAuth, express.json(), (req, res, next) => {
    const newData = { ...req.body }

    ListsService.updateList(req.app.get('db'), req.params.list_id, newData)
      .then(() => res.status(200).end())
      .catch(next)
  })

  //get all recipes for given list
listsRouter
  .route('/:list_id/recipes')
  .get(jwtAuth, userAuth, (req, res, next) => {
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

//specific recipe in a list
listsRouter
  .route('/:list_id/recipes/:recipe_id')
  .delete(jwtAuth, userAuth, (req, res, next) => {
    ListsService.getRecipeForListById(req.app.get('db'), req.params.list_id, req.params.recipe_id)
      .then(recipes => {
        if(!recipes) {
          return res.status(404).json({error: 'not found'})
        }
        ListsService.deleteRecipeInList(req.app.get('db'), req.params.list_id, req.params.recipe_id)
          .then(() => res.status(204).end())
      })
      .catch(next)
  })
  .post(jwtAuth, express.json(), (req, res, next) => {
    console.log(req.body)
    const newEntry = { ...req.body }
    ListsService.addRecipeToList(req.app.get('db'), newEntry)
      .then(() => res.status(204).end())
      .catch(next)
  })


module.exports = listsRouter;