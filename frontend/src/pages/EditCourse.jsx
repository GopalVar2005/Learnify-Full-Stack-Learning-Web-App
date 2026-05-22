import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        price: '',
        desc: '',
        category: ''
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/courses/${id}`);
                if (response.data.success) {
                    const { name, img, price, desc, category } = response.data.course;
                    setFormData({ name, img, price, desc, category });
                }
            } catch (error) {
                console.error('Error fetching course', error);
            }
        };
        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/courses/${id}`, formData);
            if (response.data.success) {
                navigate(`/courses/${id}`);
            }
        } catch (error) {
            console.error('Error updating course', error);
            alert('Failed to update course');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <h2 className="mb-4">Edit Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Course Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input type="text" name="img" className="form-control" value={formData.img} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="desc" className="form-control" rows="3" value={formData.desc} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-warning">Update Course</button>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;
