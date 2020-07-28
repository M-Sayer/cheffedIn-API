const express = require('express');

const loginRouter = express.Router();
const LoginService = require('./login-service');

loginRouter
  .route('/')
  .post(express.json(), (req, res, next) => {
    const { user_name, password } = req.body;
    const creds = { user_name, password};
    
    //verify inputs aren't null
    if(user_name == null || password == null) {
      return res.status(401).json({
        error: 'missing credentials'
      })
    } 
    //verify user in DB
    LoginService.verifyUsername(req.app.get('db'), creds.user_name)
      .then(user => {
        if(!user) {
          return res.status(401).json({
            error: 'invalid credentials'
          })
        } //verify password matches hashed pw in DB
        LoginService.veryifyPassword(creds.password, user.password)
          .then(match => {
            if(!match) {
              return res.status(401).json({
                error: 'invalid credentials'
              })
            } //create jwt & return
            const subject = user.user_name;
            const payload = { uid: user.id };

            res.send({authToken: LoginService.createJwt(subject, payload) })
          
          })
          .catch(next)
      })
    

    
  })

module.exports = loginRouter;