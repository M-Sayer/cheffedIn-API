const CommentsService = require('../comments/comments-service');

function userAuth(req, res, next) {
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
        });
      }
      uid = comment.author_id;
      if(uid !== reqId) {
        return res.status(401).json({
          error: 'unauthorized access'
        });
      } 
      next();
    })
    .catch(next);
}

module.exports = userAuth;