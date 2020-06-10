'use strict'

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const models = require('../models');
const { User } = models;

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const users = await User.findAll();
  const credentials = auth(req);
  if (credentials) {
    const user = users.find(u => u.emailAddress === credentials.name);
    // STOPPED HERE
  }
  // next();
}

function asyncHandler (cb) {
  return async (req,res,next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}

router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
  console.log('Hello');
  // const users = await User.findAll();
  // res.send(users);
}));


module.exports = router;