const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    recipes_in_lists,
    lists,
    comments,
    recipes,
    users
    RESTART IDENTITY CASCADE;
    `
  )
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'user1',
      first_name: 'user',
      last_name: 'one',
      email: 'user1@test.com',
      password: 'password1'
    },
    {
      id: 2,
      user_name: 'user2',
      first_name: 'user',
      last_name: 'two',
      email: 'user2@test.com',
      password: 'password2'
    },
    {
      id: 3,
      user_name: 'user3',
      first_name: 'user',
      last_name: 'three',
      email: 'user3@test.com',
      password: 'password3'
    },
  ]
};

function makeRecipesArray(users) {
  return [
    {
      id: 1,
      author_id: users[0].id,
      title: 'meat lovers pizza',
      image: 'https://loremflickr.com/750/300/landscape?random',
      about: 'lorem',
      dish_type: 'main',
      prep_time_minutes: '15',
      prep_time_hours: '1',
      serving_size: '4',
      vegetarian: false,
      ingredients: 'some ingredients',
      steps: 'some steps',
      date_added: '2020-07-27T18:03:13.574Z'
    },
    {
      id: 2,
      author_id: users[1].id,
      title: 'soup',
      image: 'https://loremflickr.com/750/300/landscape?random',
      about: 'lorem',
      dish_type: 'side',
      prep_time_minutes: '45',
      prep_time_hours: '0',
      serving_size: '6',
      vegetarian: true,
      ingredients: 'some ingredients',
      steps: 'some steps',
      date_added: '2020-07-27T18:03:13.574Z'
    },  
    {
      id: 3,
      author_id: users[2].id,
      title: 'salad',
      image: 'https://loremflickr.com/750/300/landscape?random',
      about: 'lorem',
      dish_type: 'appetizer',
      prep_time_minutes: '15',
      prep_time_hours: '0',
      serving_size: '4',
      vegetarian: true,
      ingredients: 'some ingredients',
      steps: 'some steps',
      date_added: '2020-07-27T18:03:13.574Z'
    },    
  ]
};

function makeCommentsArray(users, recipes) {
  return [
    {
      id: 1,
      recipe_id: recipes[0].id,
      author_id: users[2].id,
      message: 'delicious',
      date_added: '2020-07-27T18:03:13.574Z'
    },
    {
      id: 2,
      recipe_id: recipes[1].id,
      author_id: users[0].id,
      message: 'great',
      date_added: '2020-07-27T18:03:13.574Z'
    },
    {
      id: 3,
      recipe_id: recipes[2].id,
      author_id: users[1].id,
      message: 'lovely',
      date_added: '2020-07-27T18:03:13.574Z'
    },
  ]
};

function makeListsArray(users) {
  return [
    {
      id: 1,
      author_id: users[0].id,
      list_name: 'favorites'
    },
    {
      id: 2,
      author_id: users[1].id,
      list_name: 'things i like'
    },
    {
      id: 3,
      author_id: users[2].id,
      list_name: 'make later'
    },

  ]
};

function makeRecipesInListsArray(recipes, lists) {
  return [
    {
      id: 1,
      recipe_id: recipes[0].id,
      list_id: lists[2].id
    },
    {
      id: 2,
      recipe_id: recipes[1].id,
      list_id: lists[0].id
    },
    {
      id: 3,
      recipe_id: recipes[2].id,
      list_id: lists[1].id
    },
  ]
};

function makeFixtures() {
  const users = makeUsersArray();
  const recipes = makeRecipesArray(users);
  const comments = makeCommentsArray(users, recipes);
  const lists = makeListsArray(users);
  const recipesInLists = makeRecipesInListsArray(recipes, lists);

  return { users, recipes, comments, lists, recipesInLists };
}

function seedUsers(db, users) {
  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }))
  
  return db('users').insert(hashedUsers)
    .then(() => {
      return db.raw(`
      SELECT setval ('users_id_seq', ?)`, [users[users.length-1].id])
    })
}

function seedTables(db, users, recipes, comments, lists, recipesInLists) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)

    await trx('recipes').insert(recipes)
    
    await trx.raw(`
    SELECT setval ('recipes_id_seq', ?)`, [recipes[recipes.length-1].id])

    await trx('comments').insert(comments)

    await trx.raw(`
    SELECT setval ('comments_id_seq', ?)`, [comments[comments.length-1].id]
    )

    await trx('lists').insert(lists)

    await trx.raw(`
    SELECT setval ('lists_id_seq', ?)`, [lists[lists.length-1].id])

    await trx('recipes_in_lists').insert(recipesInLists)

    await trx.raw(`
    SELECT setval ('recipes_in_lists_id_seq', ?)`, [recipesInLists[recipesInLists.length-1].id])

  })
}

function makeExpectedRecipes(users, recipes) {
  const expectedRecipes = recipes.map(recipe => {
    const author = users.find(user => user.id === recipe.author_id)
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        about: recipe.about,
        dish_type: recipe.dish_type,
        prep_time_minutes: recipe.prep_time_minutes,
        prep_time_hours: recipe.prep_time_hours,
        serving_size: recipe.serving_size,
        vegetarian: recipe.vegetarian,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        author_id: author.id,
        author: author.user_name
      }
  })
  return expectedRecipes
}

function makeExpectedComments(recipeId, comments, users) {
  const expectedComments = comments.filter(comment => comment.id === recipeId).map(comment => {
   delete comment.recipe_id
   const author = users.find(user => user.id === comment.author_id)
   return { ...comment, author: author.user_name, date_modified: null }
  })
  return expectedComments
}

function makeAuthHeaders(user, secret = process.env.JWT_SECRET) {
  //create jwt
   const token = jwt.sign(
     {user_id: user.id}, secret, {subject: user.user_name, algorithm: 'HS256'}
   )
   return `Bearer ${token}`
 }


module.exports = {
  cleanTables,
  makeFixtures,
  seedUsers, 
  seedTables,
  makeExpectedRecipes,
  makeExpectedComments,
  makeAuthHeaders
}