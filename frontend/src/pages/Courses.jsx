import { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (category) queryParams.append('category', category);

            const response = await api.get(`/courses?${queryParams.toString()}`);
            if (response.data.success) {
                setCourses(response.data.courses);
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching courses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    return (
        <div>
            <h1 className="mb-4">All Courses</h1>

            <div className="row mb-4">
                <div className="col-md-8">
                    <form onSubmit={handleSearch} className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-primary">Search</button>
                    </form>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            // Trigger fetch immediately or wait for search button? 
                            // Better to separate or use effect. For simplicity, just set state and user hits search or we use effect on category change
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <button className="btn btn-secondary" onClick={fetchCourses}>Apply Filters</button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {courses.map(course => (
                        <div className="col" key={course._id}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                    {courses.length === 0 && <p>No courses found.</p>}
                </div>
            )}
        </div>
    );
};

export default Courses;
