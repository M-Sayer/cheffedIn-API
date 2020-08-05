const bcrypt = require('bcrypt')  

const RegisterService = {
  checkNameAvailable(db, user_name) {
    return db('users').where({user_name}).first()
  },
  checkEmailAvailable(db, email) {
    return db('users').where({ email }).first()
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10)
  },
  postNewUser(db, newUser) {
    return db('users').insert(newUser)
      .returning('*').then(([user]) => user)
  }
}

module.exports = RegisterService;