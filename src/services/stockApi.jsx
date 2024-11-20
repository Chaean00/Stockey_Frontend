import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const stockApi = {
  // 주식 종목 검색
  searchStock: (stockName) => axiosInstance.get(`/stocks/${stockName}`),

  // 주식 차트 조회
  getStockChart: (stock_code) => axiosInstance.get(`/stocks/chart/${stock_code}`),
};

export default stockApi;
