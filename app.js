require('dotenv').config()
const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const seedDB =require("./seed.js");
const ejsMate=require("ejs-mate") 
const methodOverride =require('method-override')
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/User.js')

const courseRoutes=require("./routes/course.js")
const reviewRoutes=require("./routes/review.js")
const authRoutes=require("./routes/auth.js")
const enrollmentsRoutes=require("./routes/enrollments.js")
const dashboardRoutes=require("./routes/dashboard.js")
const { errorHandler } = require('./middleware/errorHandler')

// mongodb://127.0.0.1 -> local machine
// 27017 -> port where mongoDB server runs
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("DB connected successfully")
})
.catch((error)=>{
    console.log("DB error:",error)
});

let configSession={
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }
}

app.engine('ejs', ejsMate); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));   // views folder
app.use(express.static(path.join(__dirname, 'public')));     // public folder
app.use(express.urlencoded({extended:true}))    // iske bina create nhi hoga form se
app.use(methodOverride('_method'))
app.use(session(configSession))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next)=>{
    // only for views
    // an object that holds variables accessible in templates.
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

// PASSPORT
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// seeding database
// bar bar seed nhi krna to ak baar krke comment vrna nodemon har baar seed krega
//seedDB();

app.use(courseRoutes);
app.use(reviewRoutes); 
app.use(authRoutes); 
app.use(enrollmentsRoutes);
app.use(dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler); 

app.listen(8080, ()=>{
    console.log(`Server is listening at 8080`)
});

// module.exports=app;  app ko export nhi kr skte