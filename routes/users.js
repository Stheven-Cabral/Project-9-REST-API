'use strict'

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { authenticateUser } = require('./middleware/authenticate-user');
const User = require('../models').User;

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
  const user = req.currentUser;

  res.status(200).json({
    firstName: user.firstName, 
    lastName: user.lastName,
    email: user.emailAddress,
  });
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res, next) => {
  let newUser;

  try {
    newUser = await req.body;
    
    // Hash the new user's password using bcryptjs
    if (newUser.password) {
      newUser.password = bcryptjs.hashSync(newUser.password);
    } else {
      throw new Error("I'm sorry. Something went wrong.");
      
    }
  
    // Add new user with hashed password to database 
    await User.create(newUser);
    
    //Set response status to 201 and end response
    res.status(201).location('/').end();

  } catch (err) {
    next(err);
  }
}));


module.exports = router;