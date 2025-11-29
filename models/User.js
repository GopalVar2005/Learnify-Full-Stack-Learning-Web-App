const mongoose = require('mongoose');
const Course=require('./Course')
const passportLocalMongoose=require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum: ['student', 'instructor']
    },
    enrollments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ],
    progress: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        completedAt: Date
    }]
})

userSchema.plugin(passportLocalMongoose)

let User = mongoose.model('User' , userSchema);
module.exports = User;