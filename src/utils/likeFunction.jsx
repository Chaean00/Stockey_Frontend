import userApi from '../services/userApi';

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
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
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

export { addLike, removeLike, findInitialLikeStock };
