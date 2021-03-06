BEGIN;

TRUNCATE
  recipes_in_lists,
  lists,
  comments,
  recipes,
  users
  RESTART IDENTITY CASCADE;


INSERT INTO users (id, user_name, first_name, last_name, email, password)
  VALUES
  (1, 'user1', 'user', 'one', 'user1@test.com', '$2b$10$VtdQCVjAfp9b/mZ3LBWvQeKZzk657TBsYv8BGucSuC6lYw9ZD2eHK'),
  (2, 'user2', 'user', 'two', 'user2@test.com', '$2b$10$9/coW7549wUeO//ELPhLqO4OjVBf7HKtoo63qgecd.buBDcYv4Uaa'),
  (3, 'user3', 'user', 'three', 'user3@test.com', '$2b$10$3LzP6sEW8xja8WfVK78WOOfI7AhDk3jV1BrPN4UCazh1YzjR3kcNa');

SELECT setval ('users_id_seq', 3);

INSERT INTO recipes (id, author_id, title, image, about, dish_type, prep_time_minutes, prep_time_hours, serving_size, vegetarian, ingredients, steps, date_added)
  VALUES
  (1, 1, 'meat lovers pizza', 'https://loremflickr.com/750/300/landscape?random', 'lorem', 'main', '15', '1', '4', 'false', 'some ingredients', 'some steps',  '2020-07-27T18:03:13.574Z'),
  (2, 2, 'soup', 'https://loremflickr.com/750/300/landscape?random', 'lorem', 'side', '45', '0', '6', 'true', 'some ingredients', 'some steps',  '2020-07-27T18:03:13.574Z'),
  (3, 3, 'salad', 'https://loremflickr.com/750/300/landscape?random', 'lorem', 'appetizer', '15', '0', '4', 'true', 'some ingredients', 'some steps', '2020-07-27T18:03:13.574Z');

SELECT setval ('recipes_id_seq', 3);

INSERT INTO comments (id, recipe_id, author_id, message, date_added)
  VALUES
  (1, 1, 3, 'delicious', '2020-07-27T18:03:13.574Z'),
  (2, 2, 1, 'great', '2020-07-27T18:03:13.574Z'),
  (3, 3, 2, 'lovely', '2020-07-27T18:03:13.574Z');

SELECT setval ('comments_id_seq', 3);  

INSERT INTO lists (id, author_id, list_name)
  VALUES
  (1, 1, 'favorites'),
  (2, 2, 'things i like'),
  (3, 3, 'make later');

SELECT setval ('lists_id_seq', 3);  

INSERT INTO recipes_in_lists (id, recipe_id, list_id)
  VALUES
  (1, 1, 3),
  (2, 2, 1),
  (3, 3, 2);

  COMMIT;