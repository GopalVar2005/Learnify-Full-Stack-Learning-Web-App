const mongoose = require('mongoose');
const Review = require('./Review'); 
const User = require('./User'); 

const courseSchema = new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required:true
    } , 
    img:{
        type:String,
        trim:true
    } ,
    price: {
        type:Number,
        min:0,
        required:true
    } ,
    desc: {
        type:String,
        trim:true
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    enrollments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String
});

courseSchema.add({
  lessons: [lessonSchema]
});


// middleware jo BTS mongodb operations karwane par use hota hai and iske andar pre nd post middleware hote hai which are basically used over the schema and before the model is js class.

courseSchema.post('findOneAndDelete' , async function(course){
    if(course.reviews.length > 0){
        await Review.deleteMany({_id:{$in:course.reviews}})
    }
})



let Course = mongoose.model('Course' , courseSchema);

module.exports = Course;