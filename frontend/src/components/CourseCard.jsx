import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    return (
        <div className="card h-100">
            <img src={course.img} className="card-img-top" alt={course.name} style={{ height: '200px', objectFit: 'cover' }} />
            <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text text-truncate">{course.desc}</p>
                <p className="card-text"><strong>Price:</strong> ${course.price}</p>
                <p className="card-text"><small className="text-muted">Instructor: {course.instructor?.username}</small></p>
                <Link to={`/courses/${course._id}`} className="btn btn-primary">View Course</Link>
            </div>
        </div>
    );
};

export default CourseCard;
