DROP TABLE IF EXISTS recipes;

CREATE TYPE time_minutes AS ENUM ('0', '15', '30', '45');

CREATE TYPE time_hours AS ENUM ('0', '1', '2', '3');

CREATE TYPE servings AS ENUM ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10');

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image TEXT,
  about TEXT NOT NULL,
  prep_time_minutes time_minutes NOT NULL,
  prep_time_hours time_hours NOT NULL,
  serving_size servings NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  ingredients TEXT NOT NULL,
  steps TEXT NOT NULL,
  date_added TIMESTAMPTZ default now() NOT NULL
);