'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Authenticate connection to the database
sequelize.authenticate()
.then(() => {
  console.log('Connection to Database Succesful');
})
.catch((err) => {
  console.error('Connection to Database Error', err);
});

// Sync models
console.log('Synchronizing the models with the database...');
sequelize.sync();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Add routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global error handler
app.use(async (err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  
  if (err.name === 'SequelizeValidationError') {
    err.status = 400;
    const errors = await err.errors.map(e => e.message);
    res.status(err.status).json({
      message: "Something went wrong",
      error: errors
    });
  } else {
    res.status(err.status || 500).json({
      message: err.message
    });
  }
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
