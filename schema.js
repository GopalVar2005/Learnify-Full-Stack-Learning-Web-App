
// schema for your server side validation\\
const Joi = require('joi');

const courseSchema = Joi.object({
    name: Joi.string().required(),
    img: Joi.string().uri().required(),
    price: Joi.number().min(0).required(),
    desc: Joi.string().required(),
    category: Joi.string().optional()
});


const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment:Joi.string().required()
})

module.exports = {courseSchema,reviewSchema}
