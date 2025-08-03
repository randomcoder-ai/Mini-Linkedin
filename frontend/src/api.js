import axios from 'axios';


// Load environment variables
console.log('Base URL:', process.env.REACT_APP_BASE_URL);
const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

export default api;