const express = require('express');

const CommentsService = require('./comments-service');
const commentsRouter = express.Router();

commentsRouter
  .route('/')
  .post(express.json(), (req, res, next) => {
    const newComment = { ...req.body };

    CommentsService.createCommentForRecipe(req.app.get('db'), newComment)
      .then(comment => {
        res.status(201).json(comment)
      })
      .catch(next)

  })

commentsRouter
  .route('/:comment_id')
  .delete((req, res, next) => {
    CommentsService.deleteComment(req.app.get('db'), req.params.comment_id)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .patch(express.json(), (req, res, next) => {
    const newData = { ...req.body };
    CommentsService.updateComment(req.app.get('db'), req.params.comment_id, newData)
      .then(() => res.status(204).end())
      .catch(next)
  })

module.exports = commentsRouter;