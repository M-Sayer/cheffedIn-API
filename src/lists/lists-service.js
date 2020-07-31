const ListsService = {
  getRecipesForList(db, list_id) {
    return db('recipes_in_lists')
      .join('recipes', {'recipe_id': 'recipes.id'})
      .select('recipes.id', 'author_id', 'title', 'image', 'about', 'dish_type', 'prep_time_minutes', 'prep_time_hours', 'serving_size')
      .where({list_id})
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
  }
}

module.exports = ListsService;