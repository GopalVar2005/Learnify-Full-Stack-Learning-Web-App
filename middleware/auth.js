const Course = require('../models/Course');
const User = require('../models/User');

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  }
  next();
};

// Check if user is an instructor
const isInstructor = (req, res, next) => {
  if (!req.user || req.user.role !== 'instructor') {
    req.flash('error', 'You do not have permission to perform this action');
    return res.redirect('/courses');
  }
  next();
};

// Check if user is enrolled in a course
const isEnrolled = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/courses');
    }
    
    const isEnrolled = user.enrollments.some(
      (enrolledId) => enrolledId.toString() === id
    );
    
    if (!isEnrolled) {
      req.flash('error', 'You must be enrolled in this course to perform this action');
      return res.redirect(`/courses/${id}`);
    }
    
    next();
  } catch (err) {
    req.flash('error', 'Something went wrong');
    return res.redirect('/courses');
  }
};

// Check if user is the instructor of a specific course
const isCourseInstructor = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      req.flash('error', 'Course id missing in request');
      return res.redirect('/courses');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/courses');
    }

    if (!course.instructor || !course.instructor.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to perform this action');
      return res.redirect('/courses');
    }

    req.course = course;
    next();
  } catch (err) {
    req.flash('error', 'Something went wrong');
    return res.redirect('/courses');
  }
};

module.exports = {
  isAuthenticated,
  isInstructor,
  isEnrolled,
  isCourseInstructor
};

