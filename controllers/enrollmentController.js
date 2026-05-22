const Course = require('../models/Course');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');

// Enroll in course
// Adds the course to user's enrollments and initializes their progress
const enrollInCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Idempotency check: prevent duplicate enrollment
  const alreadyEnrolled = user.enrollments.some(
    (enrolledCourse) => enrolledCourse.toString() === courseId
  );

  if (alreadyEnrolled) {
    return res.json({ success: true, message: 'You are already enrolled in this course' });
  }

  // Add course to user's list
  user.enrollments.push(courseId);

  // Initialize progress tracking (0 lessons completed)
  user.progress.push({
    courseId: courseId,
    completedLessons: []
  });

  // Add user to course's student list (for instructor analytics)
  course.enrollments.push(userId);

  await user.save();
  await course.save();

  res.status(201).json({ success: true, message: 'Successfully enrolled in course!' });
});

module.exports = {
  enrollInCourse
};

