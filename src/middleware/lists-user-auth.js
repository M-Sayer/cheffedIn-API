const ListsService = require('../lists/lists-service');

function userAuth(req, res, next) {
  const reqId = req.user.id;
  const listId = req.params.list_id;
  let uid;

  ListsService.getListById(req.app.get('db'), listId)
    .then(list => {
      if(!list) {
        return res.status(404).json({
          error: 'list not found'
        })
      }
      uid = list.author_id
      if(uid !== reqId) {
        return res.status(401).json({
          error: 'unauthorized access'
        })
      }
      req.list = list 
      next()
    })
    .catch(next)
}

module.exports = userAuth;