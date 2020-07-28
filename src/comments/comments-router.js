const express = require('express');

const CommentsService = require('./comments-service');
const commentsRouter = express.Router();

commentsRouter
  .route('/')
  .get(express.json(), (req, res, next) => {
    CommentsService.getCommentsForRecipe(req.app.get('db'), req.body.recipe_id)
      .then(comment => {
        return res.status(200).json(comment)
      })
      .catch(next)
  })
  .post(express.json(), (req, res, next) => {
    const newComment = { ... req.body };

    

  })

module.exports = commentsRouter;