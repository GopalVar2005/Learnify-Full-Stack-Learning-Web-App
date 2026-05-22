# Learnify — Frontend

React SPA for the Learnify online learning platform.

## Tech Stack

- **React 19** with React Router v7
- **Vite** for blazing-fast development
- **Bootstrap 5** for responsive UI
- **Axios** for API communication

## Getting Started

```bash
npm install
npm run dev       # Starts dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

> The Vite dev server proxies all API routes to the Express backend at `http://localhost:8080`. See `vite.config.js` for proxy configuration.

## Project Structure

```
src/
├── App.jsx              # Router + global auth state
├── main.jsx             # React DOM entry
├── services/
│   └── api.js           # Axios instance
├── components/
│   ├── Navbar.jsx       # Role-based navigation
│   ├── Footer.jsx
│   └── CourseCard.jsx   # Reusable course card
└── pages/
    ├── Courses.jsx              # Browse & filter courses
    ├── CourseDetails.jsx        # Course player + enrollment
    ├── NewCourse.jsx            # Create course (instructor)
    ├── EditCourse.jsx           # Edit course (instructor)
    ├── AddLesson.jsx            # Upload video (instructor)
    ├── StudentDashboard.jsx     # Progress tracking
    ├── InstructorDashboard.jsx  # Analytics
    ├── Login.jsx
    └── Register.jsx
```
