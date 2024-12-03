import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const stockApi = {
  // 주식 종목 검색
  searchStock: (stockName) => axiosInstance.get(`/stocks/name/${stockName}`),

  // 주식 차트 조회
  getStockChart: (stock_code, chart_period) => axiosInstance.get(`/stocks/chart/${stock_code}/${chart_period}`),

  //아이디로 주식 조회
  getStockById: (stock_id) => axiosInstance.get(`/stocks/id/${stock_id}`),

  getStcokRankByUserLike: () => axiosInstance.get(`/users/stocks/rankings/userLike`),

  getTopStock: () => axiosInstance.get(`/stocks/top`),
};

export default stockApi;
