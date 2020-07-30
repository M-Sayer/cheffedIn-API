const express = require('express');

const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const requireJwt = require('../middleware/jwt-auth');

commentsRouter
  .route('/')
  .post(requireJwt, express.json(), (req, res, next) => {
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
  .delete(requireJwt, (req, res, next) => {
    //verify request user id is same as author id
    //get client uid
    const reqId = req.user.id;
    //get uid of comment to delete
    const commentId = req.params.comment_id;
    let uid;
    CommentsService.getById(req.app.get('db'), commentId)
      .then(comment => {
        if(!comment) {
          return res.status(404).json({
            error: 'comment not found'
          })
        }
        uid = comment.author_id
        if(uid !== reqId) {
          return res.status(401).json({
            error: 'unauthorized access'
          })
        } else {
          CommentsService.deleteComment(req.app.get('db'), commentId)
            .then(() => res.status(204).end())
            .catch(next)
        }
      })
      .catch(next)
  })
  .patch(requireJwt, express.json(), (req, res, next) => {
    const newData = { ...req.body };
    
    const reqId = req.user.id
    const commentId = req.params.comment_id;
    let uid;
    CommentsService.getById(req.app.get('db'), commentId)
      .then(comment => {
        if(!comment) {
          return res.status(404).json({
            error: 'comment not found'
          })
        }
        uid = comment.author_id
        if(uid !== reqId) {
          return res.status(401).json({
            error: 'unauthorized access'
          })
        } else {
          CommentsService.updateComment(req.app.get('db'), req.params.comment_id, newData)
            .then(() => res.status(204).end())
            .catch(next)
        }
      })
      .catch(next)

  })

module.exports = commentsRouter;