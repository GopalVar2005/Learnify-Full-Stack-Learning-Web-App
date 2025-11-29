// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join(', ');
    req.flash('error', messages);
    return res.redirect('back');
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    req.flash('error', 'Invalid ID format');
    return res.redirect('/courses');
  }
  
  // Joi validation error
  if (err.isJoi) {
    req.flash('error', err.details[0].message);
    return res.redirect('back');
  }
  
  // Default error
  req.flash('error', err.message || 'Something went wrong');
  res.status(err.status || 500).render('error', { err: err.message || 'Internal Server Error' });
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, catchAsync };

