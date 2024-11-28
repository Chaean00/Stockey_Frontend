import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const keywordApi = {
  //특정 종목에 대한 키워드 랭킹 반환
  getKeywordRankAboutStock: (stock_id) => axiosInstance.get(`/keywords/stocks/${stock_id}`),

  getStockRankAboutKeyword: (keyword_id) => axiosInstance.get(`/keywords/${keyword_id}/stock-rankings`),

  getKeywordRank: () => axiosInstance.get(`/keywords/total-rankings`),

  searchKeywordByWord: (word) => axiosInstance.get(`/keywords/${word}`),

  getTopKeywrod: () => axiosInstance.get(`/keywords/top-keyword`)
};

export default keywordApi;
