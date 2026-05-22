import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import NewCourse from './pages/NewCourse';
import EditCourse from './pages/EditCourse';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AddLesson from './pages/AddLesson';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null); // Global user state
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  // Fetches current user from backend session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get('/current_user');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} setUser={setUser} />
      <div className="container mt-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" />} />
          <Route path="/courses" element={<Courses />} />
          {/* Main Course Player / Details Page */}
          <Route path="/courses/:id" element={<CourseDetails user={user} />} />

          {/* Auth Routes - Redirect to courses if already logged in */}
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/courses" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/courses" />} />

          {/* Instructor Protected Routes */}
          <Route path="/courses/new" element={user && user.role === 'instructor' ? <NewCourse /> : <Navigate to="/login" />} />
          <Route path="/courses/:id/edit" element={user && user.role === 'instructor' ? <EditCourse /> : <Navigate to="/login" />} />
          <Route path="/courses/:id/lesson/new" element={user && user.role === 'instructor' ? <AddLesson /> : <Navigate to="/login" />} />

          {/* Dashboard Routes */}
          <Route path="/student/dashboard" element={user ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="/instructor/dashboard" element={user && user.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
