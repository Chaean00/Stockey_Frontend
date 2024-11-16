// userApi.jsx
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const userApi = {
  // 현재 사용자 정보 가져오기
  getCurrentUser: () => axiosInstance.get('/users/me'),

  // 로그아웃 처리
  logout: () => axiosInstance.post('/users/logout'),

  // 로그인 처리
  login: (credentials) => axiosInstance.post('/users/login', credentials),

  // 회원가입 처리
  register: (userData) => axiosInstance.post('/users/register', userData),
};

export default userApi;
