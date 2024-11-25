import stockApi from '../services/stockApi';

const bringStockInfo = async (stock_id, updateStockInfo) => {
  try {
    const response = await stockApi.getStockById(stock_id);
    updateStockInfo({
      stock_id: response.data.id,
      stock_name: response.data.stock_name,
      stock_code: response.data.code,
    });
  } catch (error) {
    console.error('종목 조회 실패:', error.response?.data?.message || error.message);
    alert('종목 조회에 실패했습니다...');
  }
};

const searchStock = async (search, updateSearchResult) => {
  try {
    const response = await stockApi.searchStock(search);
    updateSearchResult(response.data);
  } catch (error) {
    console.error('종목 검색 실패:', error.response?.data?.message || error.message);
    alert('종목 검색에 실패했습니다...');
  }
};

const bringStockChart = async (stock_code, updateChart, stock_period) => {
  console.log(stock_code);
  try {
    const response = await stockApi.getStockChart(stock_code, stock_period);
    updateChart(response.data);
  } catch (error) {
    console.error('차트 조회 실패:', error.response?.data?.message || error.message);
    alert('차트 조회에 실패했습니다...');
  }
};

export { bringStockChart, bringStockInfo, searchStock };
