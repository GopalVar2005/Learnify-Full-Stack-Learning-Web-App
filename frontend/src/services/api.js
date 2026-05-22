import axios from 'axios';

// Axios instance configuration
const api = axios.create({
    baseURL: '/', // Proxy handles the rest, ensuring requests go to backen at port 8080
    withCredentials: true // Important: Allows sending/receiving session cookies
});

export default api;
