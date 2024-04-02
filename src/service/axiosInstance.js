import axios from 'axios';

const baseURL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
});

const fetchToken = async () => {
  const response = await axios.get(`${baseURL}/auth/tokenV2`);
  return response.data.data.token;
};

let token = null;

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!token) {
      token = await fetchToken();
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      token = await fetchToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
