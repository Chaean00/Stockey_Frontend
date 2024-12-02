import keywordApi from '../services/keywordApi';
import { toast } from 'react-toastify';
// 키워드 검색 함수
const searchKeyword = async (search, updateSearchResult) => {
  try {
    const response = await keywordApi.searchKeywordByWord(search);
    updateSearchResult(response.data);
  } catch (error) {
    console.error('키워드 검색 실패:', error.response?.data?.message || error.message);
    toast.error('키워드 검색에 실패했습니다...');
  }
};

const setUpKeywordDataAndStockInfo = async (keyword_id, updateKeywordData, updateStockInfo) => {
  try {
    const response = await keywordApi.getStockRankAboutKeyword(keyword_id);
    updateKeywordData(response.data);
    updateStockInfo({
      stock_id: response.data.stock_rankings[0].id,
      stock_name: response.data.stock_rankings[0].stock_name,
      stock_code: response.data.stock_rankings[0].code,
    });
  } catch (error) {
    console.error('키워드 데이터를 가져오는 중 오류 발생:', error);
  }
};

export { searchKeyword, setUpKeywordDataAndStockInfo };
