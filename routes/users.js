'use strict'

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { authenticateUser } = require('./middleware/authenticate-user');
const User = require('../models').User;


// asynHandler middleware - catches any route errors and uses next to pass any errors to the global error handler.
function asyncHandler (cb) {
  return async (req, res, next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      next(err);
    }
  }
}


// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
  const user = await User.findByPk(req.currentUser.id, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  });

  res.status(200).json(user);
}));


// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res, next) => {

  try {
    const newUser = await req.body;
    let existingUser;

    if (newUser.emailAddress) {
      existingUser = await User.findOne({
        where: {
          emailAddress: newUser.emailAddress
        }
      });
    }
    
    if (!existingUser) {
      // Hash the new user's password using bcryptjs
      if (newUser.password) {
        newUser.password = bcryptjs.hashSync(newUser.password);
      }

      // Add new user with hashed password to database 
      await User.create({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailAddress: newUser.emailAddress,
        password: newUser.password
      });
    
      //Set response status to 201 and end response
      res.status(201).location('/').end();

    } else {
      res.status(405).json({ message: `The email address ${newUser.emailAddress} already exists.` });
    }

  } catch (err) {
    next(err);
  }
}));


module.exports = router;