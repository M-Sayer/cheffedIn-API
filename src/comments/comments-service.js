const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db('comments').where({id}).first()
  },
  createCommentForRecipe(db, newComment) {
    return db('comments').insert(newComment)
      .returning('*')
      .then(([comment]) => comment)
  },
  deleteComment(db, id) {
    return db('comments').where({id}).delete()
  },
  updateComment(db, id, newData) {
    return db('comments').where({id}).update(newData)
  },
  serializeComment(comment) {
    return {
      ...comment,
      message: xss(comment.message),
    }
  }
}

module.exports = CommentsService;