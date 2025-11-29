const Course = require('../models/Course');
const Review = require('../models/Review');
const { catchAsync } = require('../middleware/errorHandler');

// Get all courses with search, filter, and pagination
const getAllCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;
  
  // Build query
  let query = {};
  
  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  
  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by rating (if we add average rating to course)
  // For now, we'll skip rating filter as it requires aggregation
  
  const courses = await Course.find(query)
    .populate('instructor', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  const total = await Course.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  
  // Get unique categories for filter dropdown
  const categories = await Course.distinct('category').catch(() => []);
  
  res.render('courses/index', {
    courses: courses || [],
    currentPage: page,
    totalPages: totalPages || 1,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    search: req.query.search || '',
    category: req.query.category || '',
    categories: categories || []
  });
});

// Show new course form
const showNewCourseForm = (req, res) => {
  res.render('courses/new');
};

// Create new course
const createCourse = catchAsync(async (req, res) => {
  const { name, img, price, desc, category } = req.body;
  await Course.create({
    name,
    img,
    price,
    desc,
    category: category || 'General',
    instructor: req.user._id
  });
  req.flash('success', 'Course added successfully');
  res.redirect('/courses');
});

// Show course details
const showCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id)
    .populate('reviews')
    .populate('instructor', 'username');
  
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  // Check if user is enrolled
  let isEnrolled = false;
  let userProgress = null;
  let isInstructor = false;
  
  if (req.user) {
    const user = await require('../models/User').findById(req.user._id);
    isEnrolled = user.enrollments.some(
      (enrolledId) => enrolledId.toString() === id
    );
    
    // Check if user is the course instructor
    isInstructor = course.instructor && course.instructor._id.toString() === req.user._id.toString();
    
    // Get user progress
    if (isEnrolled) {
      userProgress = user.progress.find(
        (p) => p.courseId.toString() === id
      );
    }
  }
  
  res.render('courses/show', {
    foundCourse: course,
    isEnrolled,
    userProgress,
    isInstructor
  });
});

// Show edit form
const showEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const foundCourse = await Course.findById(id);
  
  if (!foundCourse) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  res.render('courses/edit', { foundCourse });
});

// Update course
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, img, price, desc, category } = req.body;
  
  await Course.findByIdAndUpdate(id, {
    name,
    img,
    price,
    desc,
    category: category || 'General'
  });
  
  req.flash('success', 'Course edited successfully');
  res.redirect(`/courses/${id}`);
});

// Delete course
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  // Delete all reviews
  if (course.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: course.reviews } });
  }
  
  await Course.findByIdAndDelete(id);
  req.flash('success', 'Course deleted successfully');
  res.redirect('/courses');
});

// Show add lesson form
const showAddLessonForm = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  res.render('courses/addLesson', { course });
});

// Add lesson
const addLesson = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  const { title, description } = req.body;
  const videoUrl = req.file ? req.file.path : '';
  
  course.lessons.push({ title, description, videoUrl });
  await course.save();
  
  req.flash('success', 'Lesson added successfully!');
  res.redirect(`/courses/${course._id}`);
});

// Delete lesson
const deleteLesson = catchAsync(async (req, res) => {
  const { id, lessonId } = req.params;
  const course = await Course.findById(id);
  
  if (!course) {
    req.flash('error', 'Course not found');
    return res.redirect('/courses');
  }
  
  const lesson = course.lessons.id(lessonId);
  if (!lesson) {
    req.flash('error', 'Lesson not found');
    return res.redirect(`/courses/${id}`);
  }
  
  lesson.deleteOne();
  await course.save();
  
  req.flash('success', 'Lesson deleted successfully');
  res.redirect(`/courses/${id}`);
});

// Mark lesson as completed
const completeLesson = catchAsync(async (req, res) => {
  const { id, lessonId } = req.params;
  const userId = req.user._id;
  
  const User = require('../models/User');
  const user = await User.findById(userId);
  const course = await Course.findById(id);
  
  if (!course || !user) {
    req.flash('error', 'Course or user not found');
    return res.redirect('/courses');
  }
  
  // Check if enrolled
  const isEnrolled = user.enrollments.some(
    (enrolledId) => enrolledId.toString() === id
  );
  
  if (!isEnrolled) {
    req.flash('error', 'You must be enrolled in this course');
    return res.redirect(`/courses/${id}`);
  }
  
  // Get or create progress entry
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
    
    // Check if all lessons completed
    if (progress.completedLessons.length === course.lessons.length) {
      progress.completedAt = new Date();
    }
    
    await user.save();
    req.flash('success', 'Lesson marked as completed!');
  } else {
    req.flash('info', 'Lesson already completed');
  }
  
  res.redirect(`/courses/${id}`);
});

module.exports = {
  getAllCourses,
  showNewCourseForm,
  createCourse,
  showCourse,
  showEditForm,
  updateCourse,
  deleteCourse,
  showAddLessonForm,
  addLesson,
  deleteLesson,
  completeLesson
};

