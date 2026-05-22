import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CourseDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    // User-specific state
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    const [userProgress, setUserProgress] = useState(null);

    // Fetch course details and user association (enrollment/ownership)
    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            if (response.data.success) {
                setCourse(response.data.course);
                setIsEnrolled(response.data.isEnrolled);
                setIsInstructor(response.data.isInstructor); // True if current user owns this course
                setUserProgress(response.data.userProgress);
            } else {
                navigate('/courses');
            }
        } catch (error) {
            console.error('Error fetching course', error);
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    // Handle student enrollment
    const handleEnroll = async () => {
        try {
            const response = await api.post(`/courses/${id}/enroll`);
            if (response.data.success) {
                alert('Enrolled successfully!');
                fetchCourse(); // Refresh state to show columns/video
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Enrollment failed');
        }
    };

    // Handle course deletion (Instructor only)
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await api.delete(`/courses/${id}`);
                if (response.data.success) {
                    alert('Course deleted');
                    navigate('/courses');
                }
            } catch (error) {
                alert('Failed to delete course');
            }
        }
    };

    // Mark a lesson as complete (Student only)
    const handleCompleteLesson = async (lessonId) => {
        try {
            const response = await api.post(`/courses/${id}/lessons/${lessonId}/complete`);
            if (response.data.success) {
                fetchCourse(); // Refresh progress to update UI
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Delete a lesson (Instructor only)
    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm("Delete this lesson?")) {
            try {
                await api.delete(`/courses/${id}/lessons/${lessonId}`);
                fetchCourse();
            } catch (error) {
                alert("Failed to delete lesson");
            }
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    return (
        <div className="row">
            <div className="col-md-8">
                {/* Course Header Info */}
                <img src={course.img} className="img-fluid mb-3 rounded" alt={course.name} style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
                <h1>{course.name}</h1>
                <p className="lead">{course.desc}</p>

                {/* Lessons List */}
                <h3 className="mt-4">Lessons ({course.lessons.length})</h3>
                {course.lessons.length > 0 ? (
                    <div className="list-group mb-4">
                        {course.lessons.map((lesson, index) => {
                            // Check if this specific lesson ID is in the completed list
                            const isCompleted = userProgress?.completedLessons?.includes(lesson._id);
                            return (
                                <div key={lesson._id} className={`list-group-item ${isCompleted ? 'list-group-item-success' : ''}`}>
                                    <div className="d-flex w-100 justify-content-between align-items-center">
                                        <h5 className="mb-1">{index + 1}. {lesson.title}</h5>
                                        <small>
                                            {/* Action Buttons based on Role/State */}
                                            {isInstructor && (
                                                <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeleteLesson(lesson._id)}>Delete</button>
                                            )}
                                            {isEnrolled && !isCompleted && (
                                                <button className="btn btn-sm btn-success" onClick={() => handleCompleteLesson(lesson._id)}>Mark Complete</button>
                                            )}
                                            {isCompleted && <span className="badge bg-success">Completed</span>}
                                        </small>
                                    </div>
                                    <p className="mb-1">{lesson.description}</p>

                                    {/* Video Player - Only visible if enrolled */}
                                    {isEnrolled && lesson.videoUrl && (
                                        <div className="mt-2 ratio ratio-16x9">
                                            <video controls className="w-100" controlsList="nodownload">
                                                <source src={lesson.videoUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No lessons yet.</p>
                )}

                {isInstructor && (
                    <Link to={`/courses/${id}/lesson/new`} className="btn btn-primary mb-3">Add Lesson</Link>
                )}
            </div>

            {/* Sidebar / enrollment Actions */}
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">${course.price}</h3>
                        <p className="card-text">Instructor: {course.instructor?.username}</p>

                        {user ? (
                            isInstructor ? (
                                <>
                                    <Link to={`/courses/${id}/edit`} className="btn btn-warning w-100 mb-2">Edit Course</Link>
                                    <button onClick={handleDelete} className="btn btn-danger w-100">Delete Course</button>
                                </>
                            ) : isEnrolled ? (
                                <button className="btn btn-success w-100" disabled>Already Enrolled</button>
                            ) : (
                                <button onClick={handleEnroll} className="btn btn-primary w-100">Enroll Now</button>
                            )
                        ) : (
                            <Link to="/login" className="btn btn-primary w-100">Login to Enroll</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
