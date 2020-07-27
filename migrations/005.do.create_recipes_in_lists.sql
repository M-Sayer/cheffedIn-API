DROP TABLE IF EXISTS recipes_in_lists;

CREATE TABLE recipes_in_lists (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE
);