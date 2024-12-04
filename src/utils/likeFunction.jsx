import userApi from '../services/userApi';
import { toast } from 'react-toastify';

const removeLike = async (stock_id, updateState) => {
  try {
    await userApi.removeStockLike({ stock_id: stock_id });
    updateState((prevList) => prevList.filter((like) => like.stock_id !== stock_id));
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
  }
};

const addLike = async (stock_id, stock_name, updateState) => {
  try {
    await userApi.addStockLike({ stock_id: stock_id, alarm_status: false });
    updateState((prevList) => [...prevList, { stock_id: stock_id, stock_name: stock_name }]);
    return true;
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
    if (error.response?.data?.message === 'Authorization Null') {
      toast.error('로그인 후 사용해 주세요.');
    }
    return false; // 실패 시 false 반환
  }
};

const findInitialLikeStock = async (stock_id, updateState, updateStockLikeList) => {
  try {
    const response = await userApi.getStockLike();
    const isStockLiked = response.data.userStocks.some((like) => like.stock_id === stock_id);
    updateStockLikeList(response.data.userStocks);
    updateState(isStockLiked);
  } catch (error) {
    console.error('즐겨찾기 불러오기 실패:', error.response?.data?.message || error.message);
  }
};

// 키워드 즐겨찾기 추가
const keywordAddLike = async (keyword, updateState) => {
  try {
    await userApi.addKeywordLike({ keyword: keyword, alarm_status: false });
    updateState((prevState) => {
      const updatedUserKeywords = [...prevState.userKeywords, { keyword: keyword, alarm_status: false }];
      return { ...prevState, userKeywords: updatedUserKeywords };
    });
    return true; // 성공 시 true 반환
  } catch (error) {
    console.log('키워드 즐겨찾기 추가 실패: ', error.response?.data?.message || error.message);
    if (error.response?.data?.message === 'Authorization Null') {
      toast.error('로그인 후 사용해 주세요.');
    }
    return false; // 실패 시 false 반환
  }
};

// 키워드 즐겨찾기 삭제
const keywordRemoveLike = async (keyword, updateState, keywordData) => {
  try {
    await userApi.removeKeywordLike({ keyword: keyword });
    updateState((prevState) => {
      const updatedUserKeywords = prevState.userKeywords.filter((like) => like.keyword !== keyword);
      return { ...prevState, userKeywords: updatedUserKeywords };
    });
  } catch (error) {
    console.log('키워드 즐겨찾기 삭제 실패: ', error.response?.data?.message || error.message);
  }
};

const findInitialLikeKeyword = async (keyword, updateState, updateKeywordLikeList) => {
  try {
    const response = await userApi.getKeywordLike();
    const isKewordLiked = response.data.userKeywords.some((like) => like.keyword === keyword);
    updateKeywordLikeList(response.data);
    updateState(isKewordLiked);
  } catch (error) {
    console.error('즐겨찾기 불러오기 실패:', error.response?.data?.message || error.message);
  }
};

export { addLike, removeLike, findInitialLikeStock, keywordAddLike, keywordRemoveLike, findInitialLikeKeyword };
