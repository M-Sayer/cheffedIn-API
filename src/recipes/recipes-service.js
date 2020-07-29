const RecipesService = {
  getAllRecipes(db) {
    return db('recipes')
      .join('users', {'author_id': 'users.id'})
      .select(
        'recipes.id', 'recipes.title', 'recipes.image', 'recipes.about', 'dish_type', 'prep_time_minutes', 'prep_time_hours', 'serving_size', 'vegetarian', 'ingredients', 'steps', 'recipes.author_id', db.ref('users.user_name').as('author') 
      )
      
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