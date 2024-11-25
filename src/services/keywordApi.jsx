import axios from 'axios';


const keywordApi = {
  //특정 종목에 대한 키워드 랭킹 반환
  getKeywordRankAboutStock: (stock_id) => axios.get(`/api/keywords/stocks/${stock_id}`),

  getStockRankAboutKeyword: (keyword_id) => axios.get(`/api/keywords/${keyword_id}/stock-rankings`),

  getKeywordRank: () => axios.get(`/api/keywords/total-rankings`),

  searchKeywordByWord: (word) => axios.get(`/api/keywords/${word}`)
};

export default keywordApi;
