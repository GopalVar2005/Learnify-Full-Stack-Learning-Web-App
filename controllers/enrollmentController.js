const Course = require('../models/Course');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');

// Get user enrollments
const getUserEnrollments = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrollments')
    .populate('progress.courseId');
  
  res.render('enrollments/enrollments', { user });
});

// Enroll in course
const enrollInCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);
  
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  // Check if already enrolled
  const alreadyEnrolled = user.enrollments.some(
    (enrolledCourse) => enrolledCourse.toString() === courseId
  );
  
  if (alreadyEnrolled) {
    req.flash('success', 'You are already enrolled in this course');
    return res.redirect(`/courses/${courseId}`);
  }
  
  // Enroll user
  user.enrollments.push(courseId);
  
  // Initialize progress
  user.progress.push({
    courseId: courseId,
    completedLessons: []
  });
  
  // Add user to course enrollments
  course.enrollments.push(userId);
  
  await user.save();
  await course.save();
  
  req.flash('success', 'Successfully enrolled in course!');
  res.redirect(`/courses/${courseId}`);
});

module.exports = {
  getUserEnrollments,
  enrollInCourse
};

