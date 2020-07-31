

const UsersService = {
  getUserLists(db, author_id) {
    return db('lists').select().where({author_id})
  }
}

module.exports = UsersService;