// userApi.jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

  //종목 즐겨찾기 조회
  getStockLike: () => axiosInstance.get('/users/stocks'),

  //종목 즐겨찾기 추가
  addStockLike: (stockData) => axiosInstance.post('/users/stocks', stockData),

  //종목 즐겨찾기 삭제
  removeStockLike: (stockData) => {
    axiosInstance.delete(`/users/stocks?stock_id=${stockData.stock_id}`);
  },

  // 키워드 즐겨찾기 추가
  addKeywordLike: (keywordData) => axiosInstance.post('/users/keywords', keywordData),

  // 키워드 즐겨찾기 삭제
  removeKeywordLike: (keywordData) => axiosInstance.delete(`/users/keywords?keyword=${keywordData.keyword}`),

  // 유저의 키워드 즐겨찾기 조회
  getKeywordLike: () => axiosInstance.get ('/users/keywords'),
};

export default userApi;
