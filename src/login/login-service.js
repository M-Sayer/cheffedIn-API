const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LoginService = {
  verifyUsername(db, user_name) {
    return db('users').select().where({user_name}).first()
  },
  veryifyPassword(password, hashed) {
    return bcrypt.compare(password, hashed)
  },
  createJwt(subject, payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        subject,
        algorithm: 'HS256'
      }
    )
  },
  veryifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET, {algorithms: ['HS256']})
  }  
}

module.exports = LoginService;