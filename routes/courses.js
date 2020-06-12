'use strict'

const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');
const { authenticateUser } = require('./middleware/authenticate-user');

function asyncHandler (cb) {
  return async (req, res, next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ include: User });
  res.status(200).json({ courses: courses });
}));

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {include: User});

  if (course) {
    res.status(200).json({ course: course });
  } else {
    res.status(404).json({message: "Course not found"});
  }
}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', asyncHandler(async (req, res) => {
  let course;
  try {
    course = await Course.create(req.body);
    res.status(201).location('/' + req.params.id).end()
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = await error.errors.map( err => err.message);
      res.status(400).json({ errors: errors });
    } else {
      throw error;
    }
  }
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', asyncHandler( async (req, res) => {
  let course;
  try {
    course = await Course.update(req.body, {where: {id: req.params.id}});
    res.status(204).json({ course: course});
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = await error.errors.map( err => err.message);
      res.status(400).json({ errors: errors });
    } else {
      throw error;
    }
  }
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  course = await Course.findByPk(req.params.id);
  await Course.destroy(course);
  res.status(204).end();
}));


module.exports = router;