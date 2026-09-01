import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const axiosClient = axios.create(
    {
        baseURL : API_BASE_URL,
        timeout:10000,
        withCredentials:true,
        headers:{
            'content-Type':'application/json',
            Accept: 'application/json',
        },
    });  