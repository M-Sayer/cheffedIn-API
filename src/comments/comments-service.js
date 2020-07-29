const CommentsService = {
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
  }
}

module.exports = CommentsService;