const express = require('express');

const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const jwtAuth = require('../middleware/jwt-auth');
const userAuth = require('../middleware/comments-user-auth');

commentsRouter
  .route('/')
  .post(jwtAuth, express.json(), (req, res, next) => {
    const newComment = { ...req.body };

    newComment.author_id = req.user.id

    CommentsService.createCommentForRecipe(req.app.get('db'), newComment)
      .then(comment => {
        res.status(201).json(comment)
      })
      .catch(next)

  })

commentsRouter
  .route('/:comment_id')
  .delete(jwtAuth, userAuth, (req, res, next) => {
    const commentId = req.params.comment_id;
    
    CommentsService.deleteComment(req.app.get('db'), commentId)
      .then(() => res.status(204).end())
      .catch(next)
  })
  .patch(jwtAuth, userAuth, express.json(), (req, res, next) => {
    CommentsService.updateComment(req.app.get('db'), req.params.comment_id, newData)
      .then(() => res.status(204).end())
      .catch(next)
  })

module.exports = commentsRouter;