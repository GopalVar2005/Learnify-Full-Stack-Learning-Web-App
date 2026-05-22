import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddLesson = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // For simplicity, we are handling video upload as a file input but keeping it basic as per "no complex features" rule, 
    // although backend requires multer. We will try to send as FormData.
    const [video, setVideo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (video) {
            formData.append('video', video);
        }

        try {
            // Note: Content-Type header is handled automatically by axios when passing FormData? 
            // Usually yes, but explicit header is safer.
            const response = await api.post(`/courses/${id}/lesson`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                navigate(`/courses/${id}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add lesson");
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <h2 className="mb-4">Add Lesson</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Lesson Title</label>
                        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Video File</label>
                        <input type="file" className="form-control" onChange={e => setVideo(e.target.files[0])} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Lesson</button>
                </form>
            </div>
        </div>
    );
};

export default AddLesson;
