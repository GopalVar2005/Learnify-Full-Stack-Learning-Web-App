const Course = require('../models/Course');
const Review = require('../models/Review');
const { catchAsync } = require('../middleware/errorHandler');

// Get all courses with search, filter, and pagination
// Handles listing courses for the "Browse Courses" page
const getAllCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9; // Number of courses per page
  const skip = (page - 1) * limit;

  // Build query based on optional search/filter params
  let query = {};

  // Search by name (case-insensitive regex)
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  // Filter by exact category match
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Fetch courses with pagination and instructor details
  const courses = await Course.find(query)
    .populate('instructor', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Course.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Get unique categories for filter dropdown
  const categories = await Course.distinct('category').catch(() => []);

  res.json({
    success: true,
    courses: courses || [],
    currentPage: page,
    totalPages: totalPages || 1,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    categories: categories || []
  });
});


// Create new course
// Stores new course in DB and associates it with the logged-in instructor
const createCourse = catchAsync(async (req, res) => {
  const { name, img, price, desc, category } = req.body;
  const newCourse = await Course.create({
    name,
    img,
    price,
    desc,
    category: category || 'General',
    instructor: req.user._id // Assign current user as instructor
  });
  // req.flash('success', 'Course added successfully');
  // res.redirect('/courses');
  res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });
});

// Show course details
// Fetches detailed info including lessons and user-specific enrollment status
const showCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id)
    .populate('reviews')
    .populate('instructor', 'username');

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Check if current user is enrolled (to show "Watch" vs "Enroll" buttons)
  let isEnrolled = false;
  let userProgress = null;
  let isInstructor = false;

  if (req.user) {
    const user = await require('../models/User').findById(req.user._id);
    isEnrolled = user.enrollments.some(
      (enrolledId) => enrolledId.toString() === id
    );

    // Check if user is the course instructor (to show "Edit" buttons)
    isInstructor = course.instructor && course.instructor._id.toString() === req.user._id.toString();

    // Get user progress to unlock lessons or show completion
    if (isEnrolled) {
      userProgress = user.progress.find(
        (p) => p.courseId.toString() === id
      );
    }
  }

  res.json({
    success: true,
    course,
    isEnrolled,
    userProgress,
    isInstructor
  });
});

// Show edit form - REMOVED

// Update course
// Modifies existing course details (Instructor only)
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, img, price, desc, category } = req.body;

  const updatedCourse = await Course.findByIdAndUpdate(id, {
    name,
    img,
    price,
    desc,
    category: category || 'General'
  }, { new: true });

  // req.flash('success', 'Course edited successfully');
  // res.redirect(`/courses/${id}`);
  res.json({ success: true, message: 'Course edited successfully', course: updatedCourse });
});

// Delete course
// Removes course and its associated reviews
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Delete all reviews associated with this course to prevent orphan data
  if (course.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: course.reviews } });
  }

  await Course.findByIdAndDelete(id);
  // req.flash('success', 'Course deleted successfully');
  // res.redirect('/courses');
  res.json({ success: true, message: 'Course deleted successfully' });
});

// Show add lesson form - REMOVED

// Add lesson
// Uploads video (handled by Multer middleware before this) and adds lesson metadata
const addLesson = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  const { title, description } = req.body;
  // req.file is populated by Multer-Cloudinary middleware
  const videoUrl = req.file ? req.file.path : '';

  course.lessons.push({ title, description, videoUrl });
  await course.save();

  res.status(201).json({ success: true, message: 'Lesson added successfully!', course });
});

// Delete lesson
// Removes a specific lesson from the course's lesson array
const deleteLesson = catchAsync(async (req, res) => {
  const { id, lessonId } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  const lesson = course.lessons.id(lessonId);
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  lesson.deleteOne();
  await course.save();

  res.json({ success: true, message: 'Lesson deleted successfully', course });
});

// Mark lesson as completed
// Updates user's progress tracking when they finish watching a video
const completeLesson = catchAsync(async (req, res) => {
  const { id, lessonId } = req.params;
  const userId = req.user._id;

  const User = require('../models/User');
  const user = await User.findById(userId);
  const course = await Course.findById(id);

  if (!course || !user) {
    return res.status(404).json({ success: false, message: 'Course or user not found' });
  }

  // Check if enrolled (only enrolled students can track progress)
  const isEnrolled = user.enrollments.some(
    (enrolledId) => enrolledId.toString() === id
  );

  if (!isEnrolled) {
    return res.status(403).json({ success: false, message: 'You must be enrolled in this course' });
  }

  // Get or create progress entry for this course
  let progress = user.progress.find(
    (p) => p.courseId.toString() === id
  );

  if (!progress) {
    user.progress.push({ courseId: id, completedLessons: [] });
    progress = user.progress[user.progress.length - 1];
  }

  // Add lesson if not already completed
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);

    // Check if course is fully completed
    if (progress.completedLessons.length === course.lessons.length) {
      progress.completedAt = new Date();
    }

    await user.save();
    res.json({ success: true, message: 'Lesson marked as completed!', progress });
  } else {
    res.json({ success: true, message: 'Lesson already completed', progress });
  }
});

module.exports = {
  getAllCourses,
  // showNewCourseForm,
  createCourse,
  showCourse,
  // showEditForm,
  updateCourse,
  deleteCourse,
  // showAddLessonForm,
  addLesson,
  deleteLesson,
  completeLesson
};

