const CommentsService = {
  getCommentsForRecipe(db, recipe_id) {
    return db('comments').select()
      .where({recipe_id})
  },
  createCommentForRecipe(db, recipe_id, newComment) {
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