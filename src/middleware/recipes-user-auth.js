const RecipesService = require('../recipes/recipes-service');

function userAuth(req, res, next) {
  const reqId = req.user.id;
  const recipeId = req.params.recipe_id;
  let uid;

  RecipesService.getById(req.app.get('db'), recipeId)
    .then(recipe => {
      if(!recipe) {
        return res.status(404).json({
          error: 'list not found'
        });
      }
      uid = recipe.author_id;
      if(uid !== reqId) {
        return res.status(401).json({
          error: 'unauthorized access'
        });
      }
      req.recipe = recipe;
      next();
    })
    .catch(next);
}

module.exports = userAuth;