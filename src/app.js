require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const recipesRouter = require('./recipes/recipes-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/recipes', recipesRouter)

app.get('/', (req, res) => {
  res
    .status(200) 
    .send('Hello, world!');
});

app.use(function errorHandler(error, req, res, _next) {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: {message: 'server error'}};
  } else {
    console.log(error);
    response = { message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;