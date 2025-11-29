const Joi = require('joi');
const { courseSchema, reviewSchema } = require('../schema');

// Course validation middleware
const validateCourse = (req, res, next) => {
  const { name, img, price, desc } = req.body;
  const { error } = courseSchema.validate({ name, img, price, desc });
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('back');
  }
  next();
};

// Review validation middleware
const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('back');
  }
  next();
};

// Enrollment validation schema
const enrollmentSchema = Joi.object({
  courseId: Joi.string().required()
});

// Auth validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'instructor').required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Registration validation middleware
const validateRegistration = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/register');
  }
  next();
};

// Login validation middleware
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/login');
  }
  next();
};

module.exports = {
  validateCourse,
  validateReview,
  validateRegistration,
  validateLogin
};

