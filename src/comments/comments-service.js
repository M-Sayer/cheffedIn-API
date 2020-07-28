const CommentsService = {
  getCommentsForRecipe(db, recipe_id) {
    return db('comments').select()
      .where({recipe_id})
  },
}

module.exports = CommentsService;