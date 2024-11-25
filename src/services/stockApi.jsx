import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const stockApi = {
  // 주식 종목 검색
  searchStock: (stockName) => axiosInstance.get(`/stocks/name/${stockName}`),

  // 주식 차트 조회
  getStockChart: (stock_code, chart_period) => axiosInstance.get(`/stocks/chart/${stock_code}/${chart_period}`),

  //아이디로 주식 조회
  getStockById: (stock_id) => axiosInstance.get(`/stocks/id/${stock_id}`),
};

export default stockApi;
