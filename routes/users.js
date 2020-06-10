'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const { User } = models;

function asyncHandler (cb) {
  return async (req,res,next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}

router.get('/users', asyncHandler( async (req, res) => {
  const users = await User.findAll();
  res.send(users);
}));


module.exports = router;