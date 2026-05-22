import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewCourse = () => {
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        price: '',
        desc: '',
        category: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/courses', formData);
            if (response.data.success) {
                navigate('/courses');
            }
        } catch (error) {
            console.error('Error creating course', error);
            alert('Failed to create course');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <h2 className="mb-4">Create New Course</h2>
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
                    <button type="submit" className="btn btn-primary">Create Course</button>
                </form>
            </div>
        </div>
    );
};

export default NewCourse;
