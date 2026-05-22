const Course = require('../models/Course');
const User = require('../models/User');

// Check if user is authenticated
// Wraps Passport's isAuthenticated method to protect routes
// Returns 401 if user is not logged in (session cookie missing/invalid)
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }
  next();
};

// Check if user is an instructor
// Role-based access control (RBAC) middleware
// Ensures only users with 'instructor' role can access specific routes
const isInstructor = (req, res, next) => {
  if (!req.user || req.user.role !== 'instructor') {
    return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
  }
  next();
};

// Check if user is enrolled in a course
// Authorization middleware to prevent unauthorized access to course content
const isEnrolled = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify if course ID exists in user's enrollment list
    const isEnrolled = user.enrollments.some(
      (enrolledId) => enrolledId.toString() === id
    );

    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'You must be enrolled in this course to perform this action' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// Check if user is the instructor of a specific course
// Ensures instructors can only edit/delete their OWN courses
const isCourseInstructor = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course id missing in request' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Ownership check
    if (!course.instructor || !course.instructor.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
    }

    req.course = course; // Attach course to request object for downstream use
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

module.exports = {
  isAuthenticated,
  isInstructor,
  isEnrolled,
  isCourseInstructor
};

