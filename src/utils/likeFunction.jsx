import userApi from '../services/userApi';

const removeLike = async (stock_id, updateState) => {
  try {
    await userApi.removeStockLike({ stock_id: stockInfo.stock_id });
    setIsLiked(false);
    setStockLikeList((prevList) => prevList.filter((like) => like.stock_id !== stockInfo.stock_id));
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
  }
};

const addLike = async (stock_id, stock_name, updateState) => {
  try {
    await userApi.addStockLike({ stock_id: stockInfo.stock_id, alarm_status: false });
    setIsLiked(true);
    setStockLikeList((prevList) => [...prevList, { stock_id: stockInfo.stock_id, stock_name: stockInfo.stock_name }]);
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
  }
};

const findInitialLikeStock = async () => {
  try {
    const response = await userApi.getStockLike();
    const isStockLiked = response.data.userStocks.some((like) => like.stock_id === stockInfo.stock_id);
    setStockLikeList(response.data.userStocks);
    setIsLiked(isStockLiked);
  } catch (error) {
    console.error('즐겨찾기 불러오기 실패:', error.response?.data?.message || error.message);
  }
};

export { addLike, removeLike, findInitialLikeStock };
