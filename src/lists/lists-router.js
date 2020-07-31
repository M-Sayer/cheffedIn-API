const express = require('express');

const ListsService = require('./lists-service');
const listsRouter = express.Router();

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

module.exports = listsRouter;