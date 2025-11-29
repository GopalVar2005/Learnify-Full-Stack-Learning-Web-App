const User = require('../models/User');
const passport = require('passport');
const { catchAsync } = require('../middleware/errorHandler');

// Show registration form
const showRegisterForm = (req, res) => {
  res.render('auth/signup');
};

// Register new user
const register = catchAsync(async (req, res, next) => {
  const { email, password, username, role } = req.body;
  const user = new User({ email, username, role: role || 'student' });
  const newUser = await User.register(user, password);
  
  req.login(newUser, function(err) {
    if (err) return next(err);
    req.flash('success', 'Welcome, you are registered successfully');
    res.redirect('/courses');
  });
});

// Show login form
const showLoginForm = (req, res) => {
  res.render('auth/login');
};

// Login user
const login = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, () => {
    req.flash('success', 'Welcome Back');
    res.redirect('/courses');
  });
};

// Logout user
const logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success', 'Bye, come soon');
    res.redirect('/login');
  });
};

module.exports = {
  showRegisterForm,
  register,
  showLoginForm,
  login,
  logout
};

