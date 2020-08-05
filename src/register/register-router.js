const express = require('express')

const registerRouter = express.Router()
const RegisterService = require('./register-service')
const LoginService = require('../login/login-service')

registerRouter
  .route('/')
  .post(express.json(), (req, res, next) => {
    let newUser = { ...req.body }
    //validate username is available
    RegisterService.checkNameAvailable(req.app.get('db'), req.body.user_name)
      .then(user => {
        if(user) {
          return res.status(401).json({
            error: 'username unavailable'
          })
        }  //if available, validate email is available
          RegisterService.checkEmailAvailable(req.app.get('db'), req.body.email)
            .then(email => {
              if(email) {
                return res.status(401).json({
                  error: 'email already in use'
                })
              }
              // validate information
              //replace pw with hashed pw
              RegisterService.hashPassword(req.body.password)
                .then(password => {
                  //create new user in DB
                  // newUser = { ...newUser, password: password}
                  const hashedPassword = password;
                  newUser = { ...newUser, password: hashedPassword}
                  RegisterService.postNewUser(req.app.get('db'), newUser)
                    .then(user => {
                      const subject = user.user_name
                      const payload = { uid: user.id}
                      //send a jwt
                      res.send({authToken: LoginService.createJwt(subject, payload)})
                    })
                })
            })
      })
      .catch(next)  

  })

module.exports = registerRouter