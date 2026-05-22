const Course = require('../models/Course');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');

// Student dashboard
// Fetches and aggregates data for the student view (enrolled courses, progress)
const studentDashboard = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'enrollments',
      populate: { path: 'instructor', select: 'username' } // Nested populate to get instructor names
    });

  // Calculate progress for each enrolled course
  // Iterates through user's progress array to compute completion percentage
  const coursesWithProgress = await Promise.all(
    user.enrollments.map(async (course) => {
      const progress = user.progress.find(
        (p) => p.courseId.toString() === course._id.toString()
      );

      const totalLessons = course.lessons ? course.lessons.length : 0;
      const completedLessons = progress ? progress.completedLessons.length : 0;
      // Calculate percentage, handling division by zero
      const progressPercentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
      const isCompleted = progress && progress.completedAt ? true : false;

      return {
        course,
        progress,
        totalLessons,
        completedLessons,
        progressPercentage,
        isCompleted
      };
    })
  );

  // Separate completed and in-progress courses for UI categorization
  const completedCourses = coursesWithProgress.filter(c => c.isCompleted);
  const inProgressCourses = coursesWithProgress.filter(c => !c.isCompleted);

  res.json({
    success: true,
    completedCourses,
    inProgressCourses,
    totalEnrolled: user.enrollments.length
  });
});

// Instructor dashboard
// Aggregates stats for all courses created by the instructor
const instructorDashboard = catchAsync(async (req, res) => {
  const instructorId = req.user._id;

  // Fetch all courses created by this instructor
  const courses = await Course.find({ instructor: instructorId })
    .populate('enrollments', 'username') // Get student names
    .populate('reviews');

  // Calculate stats per course (enrollments, average rating)
  const coursesWithStats = courses.map(course => {
    const totalEnrollments = course.enrollments ? course.enrollments.length : 0;
    const totalReviews = course.reviews ? course.reviews.length : 0;
    // Calculate average rating from reviews array
    const averageRating = course.reviews && course.reviews.length > 0
      ? (course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length).toFixed(1)
      : 0;

    return {
      course,
      totalEnrollments,
      totalReviews,
      averageRating
    };
  });

  // aggregated Overall stats for the top cards on dashboard
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollments ? c.enrollments.length : 0), 0);
  const totalReviews = courses.reduce((sum, c) => sum + (c.reviews ? c.reviews.length : 0), 0);

  res.json({
    success: true,
    coursesWithStats,
    totalCourses,
    totalEnrollments,
    totalReviews
  });
});

module.exports = {
  studentDashboard,
  instructorDashboard
};

