const UsersService = {
  getUserLists(db, author_id) {
    return db('lists').select().where({author_id})
  },
  getUserRecipes(db, author_id) {
    return db('recipes').select().where({ author_id })
  }
}

module.exports = UsersService;