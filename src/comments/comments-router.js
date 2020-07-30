const express = require('express');

const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const requireJwt = require('../middleware/jwt-auth');

commentsRouter
  .route('/')
  .post(requireJwt, express.json(), (req, res, next) => {
    const newComment = { ...req.body };

    CommentsService.createCommentForRecipe(req.app.get('db'), newComment)
      .then(comment => {
        res.status(201).json(comment)
      })
      .catch(next)

  })

commentsRouter
  .route('/:comment_id')
  .delete(requireJwt, (req, res, next) => {
    CommentsService.deleteComment(req.app.get('db'), req.params.comment_id)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .patch(requireJwt, express.json(), (req, res, next) => {
    const newData = { ...req.body };
    CommentsService.updateComment(req.app.get('db'), req.params.comment_id, newData)
      .then(() => res.status(204).end())
      .catch(next)
  })

module.exports = commentsRouter;