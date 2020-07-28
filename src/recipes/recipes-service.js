const RecipesService = {
  getAllRecipes(db) {
    return db('recipes').select()
  },
  getById(db, id) {
    return db('recipes').select().where({id}).first()
  },
  createRecipe(db, newRecipe) {
    return db('recipes').insert(newRecipe)
      .returning('*')  
      .then(([recipe]) => recipe)
  },
  updateRecipe(db, id, newData) {
    return this.getById(db, id)
      .update(newData)
  },
  deleteRecipe(db, id) {
    return this.getById(db, id)
      .delete()
  },
  getCommentsForRecipe(db, recipe_id) {
    return db('comments').select()
      .where({recipe_id})
  },
}

module.exports = RecipesService;