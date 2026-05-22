<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

# 🎓 Learnify — Full-Stack Online Learning Platform

A production-ready, full-stack web application for creating, managing, and consuming online courses — built with **React**, **Node.js/Express**, and **MongoDB**.

Instructors can create courses, upload video lessons via Cloudinary, and track student engagement. Students can browse courses, enroll, watch lessons, track their progress, and leave reviews.

---

## ✨ Key Features

### 👨‍🏫 Instructor Features
- Create, edit, and delete courses with image thumbnails
- Upload video lessons to Cloudinary (MP4, MOV, AVI, MKV)
- Instructor Dashboard with analytics — total enrollments, reviews, and average ratings per course
- Ownership-based authorization (instructors can only manage their own courses)

### 👨‍🎓 Student Features
- Browse & search courses with category filtering and pagination
- One-click enrollment
- Stream video lessons directly in the browser
- Track lesson completion with a visual progress bar
- Student Dashboard — view in-progress and completed courses
- Leave ratings & reviews for enrolled courses

### 🔒 Security & Architecture
- Session-based authentication using **Passport.js** (Local Strategy)
- Role-Based Access Control (RBAC) — `student` and `instructor` roles
- Multi-layered middleware: authentication → role check → ownership verification
- Server-side validation with **Joi** schemas
- Centralized error handling with typed error responses
- CORS configured for cross-origin frontend-backend communication

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  Pages   │  │Components│  │  Services (Axios API)  │ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
│         Vite Dev Proxy → localhost:8080                  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP (REST API)
┌───────────────────────▼─────────────────────────────────┐
│                Express.js Backend (API)                  │
│  ┌────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │ Routes │→ │ Middleware  │→ │    Controllers         │ │
│  │        │  │ (Auth,RBAC, │  │ (Business Logic)       │ │
│  │        │  │  Validation)│  │                        │ │
│  └────────┘  └────────────┘  └────────────────────────┘ │
│  ┌────────────────────┐  ┌──────────────────────────┐   │
│  │  Mongoose Models   │  │  Passport.js Sessions    │   │
│  └────────┬───────────┘  └──────────────────────────┘   │
└───────────┼─────────────────────────────────────────────┘
            │
  ┌─────────▼──────────┐     ┌────────────────────────┐
  │     MongoDB        │     │     Cloudinary CDN      │
  │  (Data Storage)    │     │   (Video Hosting)       │
  └────────────────────┘     └────────────────────────┘
```

---

## 📁 Project Structure

```
learnify/
├── app.js                    # Express app entry point & middleware setup
├── cloudConfig.js            # Cloudinary + Multer storage configuration
├── schema.js                 # Joi validation schemas
├── seed.js                   # Database seeder with sample courses
├── package.json
│
├── models/
│   ├── Course.js             # Course schema (lessons, reviews, enrollments)
│   ├── User.js               # User schema (roles, progress tracking)
│   └── Review.js             # Review schema (rating, comment)
│
├── controllers/
│   ├── authController.js     # Register, Login, Logout, Session check
│   ├── courseController.js   # CRUD courses, lessons, progress tracking
│   ├── dashboardController.js# Student & Instructor dashboard aggregation
│   ├── enrollmentController.js# Course enrollment logic
│   └── reviewController.js   # Review creation with enrollment check
│
├── middleware/
│   ├── auth.js               # isAuthenticated, isInstructor, isCourseInstructor
│   ├── validation.js         # Joi-based request validation middleware
│   └── errorHandler.js       # Centralized error handler + catchAsync wrapper
│
├── routes/
│   ├── auth.js               # POST /register, /login, GET /logout, /current_user
│   ├── course.js             # CRUD /courses, lessons, completion
│   ├── dashboard.js          # GET /student/dashboard, /instructor/dashboard
│   ├── enrollments.js        # POST /courses/:courseId/enroll
│   └── review.js             # POST /courses/:id/review
│
└── frontend/                 # React SPA (Vite)
    ├── src/
    │   ├── App.jsx           # Router + auth state management
    │   ├── main.jsx          # React DOM entry point
    │   ├── services/
    │   │   └── api.js        # Axios instance (base URL + credentials)
    │   ├── components/
    │   │   ├── Navbar.jsx    # Dynamic nav with role-based links
    │   │   ├── Footer.jsx
    │   │   └── CourseCard.jsx
    │   └── pages/
    │       ├── Courses.jsx           # Browse, search, filter courses
    │       ├── CourseDetails.jsx     # Course player with video + progress
    │       ├── NewCourse.jsx         # Create course form
    │       ├── EditCourse.jsx        # Edit course form
    │       ├── AddLesson.jsx         # Upload video lesson
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── StudentDashboard.jsx  # Enrolled courses + progress bars
    │       └── InstructorDashboard.jsx # Analytics + course management
    └── vite.config.js        # Dev proxy to backend
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local instance or MongoDB Atlas)
- **Cloudinary** account (free tier works) for video uploads

### 1. Clone the Repository

```bash
git clone https://github.com/GopalVar2005/Learnify-Full-Stack-Learning-Web-App.git
cd Learnify-Full-Stack-Learning-Web-App
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI, session secret, and Cloudinary credentials
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cd ..
```

### 4. Configure Environment Variables

Edit `.env` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/online-learning-platform
SESSION_SECRET=your-secret-key-here
PORT=8080
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 5. Run the Application

**Start the backend** (from root):
```bash
npm run dev        # Uses nodemon for hot-reloading
# or
npm start          # Production mode
```

**Start the frontend** (from `/frontend`):
```bash
cd frontend
npm run dev        # Starts Vite dev server on http://localhost:5173
```

> The Vite dev server proxies API calls to the Express backend on port 8080.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ✗ | Register new user |
| `POST` | `/login` | ✗ | Login with username/password |
| `GET` | `/logout` | ✓ | Logout and destroy session |
| `GET` | `/current_user` | ✗ | Get current authenticated user |
| `GET` | `/courses` | ✗ | List all courses (search, filter, paginate) |
| `POST` | `/courses` | ✓ Instructor | Create new course |
| `GET` | `/courses/:id` | ✓ | Get course details + enrollment status |
| `PATCH` | `/courses/:id` | ✓ Owner | Update course |
| `DELETE` | `/courses/:id` | ✓ Owner | Delete course + associated reviews |
| `POST` | `/courses/:id/lesson` | ✓ Instructor | Upload video lesson |
| `DELETE` | `/courses/:id/lessons/:lessonId` | ✓ Owner | Delete a lesson |
| `POST` | `/courses/:id/lessons/:lessonId/complete` | ✓ Enrolled | Mark lesson complete |
| `POST` | `/courses/:courseId/enroll` | ✓ | Enroll in a course |
| `POST` | `/courses/:id/review` | ✓ Enrolled | Submit a review |
| `GET` | `/student/dashboard` | ✓ | Student dashboard data |
| `GET` | `/instructor/dashboard` | ✓ Instructor | Instructor analytics data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Vite, Bootstrap 5, Axios |
| **Backend** | Node.js, Express 5, Passport.js, Multer |
| **Database** | MongoDB, Mongoose ODM |
| **Cloud** | Cloudinary (video storage & CDN) |
| **Validation** | Joi (server-side schema validation) |
| **Auth** | Passport Local Strategy, Express Sessions |

---

## 🧪 Sample Credentials

After running the app, the database is seeded with sample courses. Register a new account to get started:

- **Student**: Register with role `student` to browse, enroll, and track progress
- **Instructor**: Register with role `instructor` to create courses and upload lessons

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/GopalVar2005">Gopal Varshney</a>
</p>
