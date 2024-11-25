import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import stockApi from '../../services/stockApi';
import userApi from '../../services/userApi';
import ChartBox from '../../components/ChartBox/ChartBox';
import SearchInput from '../../components/SearchInput';
import LikeButton from '../../components/LikeButton';

export default function StockChartPage() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  const [stockLikeList, setStockLikeList] = useState([]);
  const { stock_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (stock_id) {
      bringStockInfo(stock_id);
    }
  }, [stock_id]);

  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart();
    }
    if (stockInfo.stock_id) {
      findInitialLikeStock();
    }
  }, [stockInfo]);

  const bringStockInfo = async (stock_id) => {
    try {
      const response = await stockApi.getStockById(stock_id);
      setStockInfo({
        stock_id: response.data.id,
        stock_name: response.data.stock_name,
        stock_code: response.data.code,
      });
    } catch (error) {
      console.error('종목 조회 실패:', error.response?.data?.message || error.message);
      alert('종목 조회에 실패했습니다...');
    }
  };

  const searchStock = async () => {
    try {
      const response = await stockApi.searchStock(search);
      setSearchResult(response.data);
    } catch (error) {
      console.error('종목 검색 실패:', error.response?.data?.message || error.message);
      alert('종목 검색에 실패했습니다...');
    }
  };

  const bringStockChart = async () => {
    try {
      const response = await stockApi.getStockChart(stockInfo.stock_code);
      setChartData(response.data);
    } catch (error) {
      console.error('차트 조회 실패:', error.response?.data?.message || error.message);
      alert('차트 조회에 실패했습니다...');
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

  const removeLike = async () => {
    try {
      await userApi.removeStockLike({ stock_id: stockInfo.stock_id });
      setIsLiked(false);
      setStockLikeList((prevList) => prevList.filter((like) => like.stock_id !== stockInfo.stock_id));
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
    }
  };

  const addLike = async () => {
    try {
      await userApi.addStockLike({ stock_id: stockInfo.stock_id, alarm_status: false });
      setIsLiked(true);
      setStockLikeList((prevList) => [...prevList, { stock_id: stockInfo.stock_id, stock_name: stockInfo.stock_name }]);
    } catch (error) {
      console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="text-black flex-grow bg-white">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">{stockInfo.stock_name}</div>
          <LikeButton isLiked={isLiked} addLike={addLike} removeLike={removeLike} />
        </div>
        <SearchInput
          search={search}
          setSearch={setSearch}
          searchResult={searchResult}
          searchStock={searchStock}
          navigate={navigate}
        />
      </div>
      <div>
        <ChartBox chartData={chartData} stockInfo={stockInfo} stockLikeList={stockLikeList} />
      </div>
    </div>
  );
}
