const mongoose = require('mongoose');

const Course = require('./models/Course');


const courses = [
    {
        name:"Full Stack Web Development Bootcamp",
        img:"https://plus.unsplash.com/premium_photo-1685086785636-2a1a0e5b591f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900" ,
        price: 2999,
        desc: "Learn to build complete web applications from scratch using HTML, CSS, JavaScript, Node.js, and MongoDB. Perfect for beginners who want to become full-stack developers." 
    },
    {
        name:"Data Structures & Algorithms in Java",
        img:"https://images.unsplash.com/photo-1526649661456-89c7ed4d00b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ2fHxQcm9ncmFtbWluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
        price: 1499 , 
        desc:"Master problem-solving and coding interview skills using Java. Includes hands-on coding exercises on arrays, linked lists, trees, graphs, and dynamic programming."
    },
    {
        name:"Machine Learning with Python",
        price:2499,
        img:"https://images.unsplash.com/photo-1653564142048-d5af2cf9b50f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2230",
        desc:"Get started with real-world ML applications using Python, NumPy, Pandas, and Scikit-learn. Build predictive models and understand core algorithms."
    },
    {
        name:"Database Management with MySQL", 
        img: "https://images.unsplash.com/photo-1662026911591-335639b11db6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U1FMfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900", 
        price: 1199, 
        desc: "Learn to design, query, and manage databases using SQL. Includes practical exercises with MySQL."
    },
    {
        name:"Build Your First Android App" , 
        img:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QW5kcm9pZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900" , 
        price: 1599 ,
        desc: "Step-by-step course to design, develop, and deploy Android apps using Kotlin and Android Studio."
    },
    {
        name:"Git & GitHub Masterclass" , 
        img:"https://images.unsplash.com/photo-1654277041218-84424c78f0ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R2l0SHVifGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900" , 
        price: 699 ,
        desc: "Learn version control, branching, pull requests, and collaboration workflows used in real software teams."
    }
]

async function seedDB(){
    // await Product.deleteMany({});
    await Course.insertMany(courses);
    console.log("data seeded successfully");
}

module.exports = seedDB;

