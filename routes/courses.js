'use strict'

const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');
const { authenticateUser } = require('./middleware/authenticate-user');


// asynHandler middleware - catches any route errors and uses next to pass any errors to the global error handler.
function asyncHandler (cb) {
  return async (req, res, next)=> {
    try {
      await cb(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}


// GET /api/courses 200 - Returns a list of courses (including the user that owns each course, but excluding 'createdAt' amd 'updatedAt' attributes)
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ attributes: {
    exclude: ['createdAt', 'updatedAt']
  }, 
  include: User });
  res.status(200).json({ courses: courses });
}));


// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course, but excluding 'createdAt' amd 'updatedAt' attributes) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }, 
    include: User});

  if (course) {
    res.status(200).json({ course: course });
  } else {
    res.status(404).json({message: "Course not found"});
  }
}));


// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {
  let course;

  try {
    course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: req.currentUser.id,
    });
    res.status(201).location('/courses/' + course.id).end();
  } catch (err) {
    next(err);
  }
}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', authenticateUser, asyncHandler( async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);

  const errors = [];

  if (course.userId === req.currentUser.id) {
    if (!req.body.title) {
      errors.push('Please provide a title.');
    }

    if (!req.body.description) {
      errors.push('Please provide a description.');
    }

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Something went wrong.',
        errors: errors
      });
    } else {
      try {
        await Course.update(req.body, {where: {id: req.params.id}});
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    }
  } else {
    res.status(403).json({
      message: "Something went wrong.",
      error: 'You are not authorized to edit this course.'});
  }
}));


// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course.userId === req.currentUser.id) {
    await Course.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(204).end();
  } else {
    res.status(403).json({message: 'You are not authorized to delete this course.'});
  }
}));


module.exports = router;