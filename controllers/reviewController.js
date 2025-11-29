const Course = require('../models/Course');
const Review = require('../models/Review');
const { catchAsync } = require('../middleware/errorHandler');

// Create review
const createReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  const course = await Course.findById(id);
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  // Check if user is enrolled
  const User = require('../models/User');
  const user = await User.findById(req.user._id);
  const isEnrolled = user.enrollments.some(
    (enrolledId) => enrolledId.toString() === id
  );
  
  if (!isEnrolled) {
    req.flash('error', 'You must be enrolled in this course to leave a review');
    return res.redirect(`/courses/${id}`);
  }
  
  const review = new Review({ rating, comment });
  course.reviews.push(review);
  
  await review.save();
  await course.save();
  
  req.flash('success', 'Review added successfully');
  res.redirect(`/courses/${id}`);
});

module.exports = {
  createReview
};

