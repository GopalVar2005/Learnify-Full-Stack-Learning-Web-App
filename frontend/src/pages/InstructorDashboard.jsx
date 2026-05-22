import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const InstructorDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/instructor/dashboard');
                if (response.data.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!dashboardData) return <div>Error loading dashboard</div>;

    const { coursesWithStats, totalCourses, totalEnrollments, totalReviews } = dashboardData;

    return (
        <div>
            <h1 className="mb-4">Instructor Dashboard</h1>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Courses</h5>
                            <p className="card-text display-4">{totalCourses}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Enrollments</h5>
                            <p className="card-text display-4">{totalEnrollments}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Reviews</h5>
                            <p className="card-text display-4">{totalReviews}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Your Courses</h3>
                <Link to="/courses/new" className="btn btn-primary">Create New Course</Link>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Enrollments</th>
                        <th>Reviews</th>
                        <th>Avg Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coursesWithStats.map(({ course, totalEnrollments, totalReviews, averageRating }) => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{totalEnrollments}</td>
                            <td>{totalReviews}</td>
                            <td>{averageRating}</td>
                            <td>
                                <Link to={`/courses/${course._id}`} className="btn btn-sm btn-info me-2">View</Link>
                                <Link to={`/courses/${course._id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                            </td>
                        </tr>
                    ))}
                    {coursesWithStats.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">No courses created yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InstructorDashboard;
