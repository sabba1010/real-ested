import { useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;

const axiosSecure = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (token) {
      axiosSecure.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
