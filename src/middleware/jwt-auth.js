const LoginService = require('../login/login-service');

function jwtAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;

  if(!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({
      error: 'missing bearer token'
    })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  try {
    const payload = LoginService.veryifyJwt(bearerToken)

    LoginService.verifyUsername(req.app.get('db'), payload.sub)
      .then(user => {
        if(!user) {
          return res.status(401).json({
            error: 'unauthorized access'
          })
        }
        req.user = user
        next()
      })
      .catch(error => {
        next(error)
      })
  }
  catch(error) {
    res.status(401).json({
      error: 'unauthorized access'
    })
  }
}

module.exports = jwtAuth;