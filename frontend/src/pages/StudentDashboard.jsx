import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data (enrolled courses + progress stats)
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/student/dashboard');
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

    const { completedCourses, inProgressCourses, totalEnrolled } = dashboardData;

    return (
        <div>
            <h1 className="mb-4">Student Dashboard</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h5>Total Enrolled Courses: {totalEnrolled}</h5>
                </div>
            </div>

            {/* In Progress Section */}
            <h3 className="mb-3">In Progress</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
                {inProgressCourses.map(({ course, progressPercentage }) => (
                    <div className="col" key={course._id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{course.name}</h5>
                                {/* Progress Bar */}
                                <div className="progress mb-3">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${progressPercentage}%` }}
                                        aria-valuenow={progressPercentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {progressPercentage}%
                                    </div>
                                </div>
                                <Link to={`/courses/${course._id}`} className="btn btn-primary">Continue Learning</Link>
                            </div>
                        </div>
                    </div>
                ))}
                {inProgressCourses.length === 0 && <p className="text-muted">No courses in progress.</p>}
            </div>

            {/* Completed Section */}
            <h3 className="mb-3">Completed</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {completedCourses.map(({ course }) => (
                    <div className="col" key={course._id}>
                        <div className="card h-100 border-success">
                            <div className="card-body">
                                <h5 className="card-title">{course.name}</h5>
                                <span className="badge bg-success mb-2">Completed</span>
                                <br />
                                <Link to={`/courses/${course._id}`} className="btn btn-outline-success mt-2">Review Course</Link>
                            </div>
                        </div>
                    </div>
                ))}
                {completedCourses.length === 0 && <p className="text-muted">No completed courses yet.</p>}
            </div>
        </div>
    );
};

export default StudentDashboard;
