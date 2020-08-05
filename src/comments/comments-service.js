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
      id: comment.id,
      recipe_id: comment.recipe_id,
      author_id: comment.author_id,
      message: xss(comment.message),
      date_added: comment.date_added
    }
  }
}

module.exports = CommentsService;