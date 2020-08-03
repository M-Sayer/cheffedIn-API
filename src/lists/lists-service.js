const ListsService = {
  getRecipesForList(db, list_id) {
    return db('recipes_in_lists')
      .join('recipes', {'recipe_id': 'recipes.id'})
      .join('lists', {'list_id': 'lists.id'})
      .select('recipes.id', 'recipes.author_id', 'title', 'image', 'about', 'dish_type', 'prep_time_minutes', 'prep_time_hours', 'serving_size')
      .where({list_id})
  },
  getRecipeForListById(db, list_id, recipe_id) {
    return db('recipes_in_lists')
      .join('recipes', {'recipe_id': 'recipes.id'})
      .select()
      .where({list_id, recipe_id})
      .first()
  },
  deleteRecipeInList(db, list_id, recipe_id) {
    return db('recipes_in_lists')
      .join('recipes', {'recipe_id': 'recipes.id'})
      .select()
      .where({list_id, recipe_id})
      .delete()
  },
  addRecipeToList(db, newEntry) {
    return db('recipes_in_lists')
      .insert(newEntry)
      .returning('*')
      .then(([entry]) => entry)
  },
  getListById(db, id) {
    return db('lists').select().where({id}).first()
  },
  postList(db, newList) {
    return db('lists').insert(newList)
      .returning('*')
      .then(([list]) => list)
  },
  deleteList(db, id) {
    return db('lists').where({id}).delete()
  },
  updateList(db, id, newData) {
    return db('lists').where({id}).update(newData)
  }
}

module.exports = ListsService;