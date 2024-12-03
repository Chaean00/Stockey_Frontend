// userApi.jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const newsApi = {
  // 크롤링한 뉴스 데이터 가져오기
  getNews: () => axiosInstance.get(`/news`),
};

export default newsApi;
