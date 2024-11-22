import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const keywordApi = {
  //특정 종목에 대한 키워드 랭킹 반환
  getKeywordRankAboutStock: (stock_id) => axiosInstance.get(`/keywords/stocks/${stock_id}`),
  getKeywordRank: () => axiosInstance.get(`/keywords/total-rankings`),
};

export default keywordApi;
