'use strict'

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const models = require('../models');
const { User } = models;

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  let message = null;
  const users = await User.findAll();
  const credentials = auth(req);

  if (credentials) {
    const user = users.find(u => u.emailAddress === credentials.name);

    if (user) {
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failed for user: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for user: ${credentials.name}`;
    }
  } else {
    message = `Authorization header not found`;
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access has Been Denied' });
  } else {
    next();
  }
};

function asyncHandler (cb) {
  return async (req,res,next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
  const user = req.currentUser;
  res.json({
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddress,
  });
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content



module.exports = router;