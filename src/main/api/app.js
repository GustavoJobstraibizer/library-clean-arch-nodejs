require('express-async-errors');
const express = require('express');
const { routes } = require('./routes');
const { ZodError } = require('zod');
const app = express();

app.use(express.json());
app.use(routes);

app.use((err, request, response, next) => {
  if (err instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation error',
      errors: err.flatten(),
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(err);
  }

  return response.status(500).json({ message: 'Internal server error' });
});

module.exports = { app };
