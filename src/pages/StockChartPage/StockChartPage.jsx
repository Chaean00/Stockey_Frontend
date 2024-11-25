import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChartBox from '../../components/ChartBox/ChartBox';
import SearchInput from '../../components/SearchInput';
import LikeButton from '../../components/LikeButton';
import { removeLike, addLike, findInitialLikeStock } from '../../utils/likeFunction';
import { bringStockChart, bringStockInfo, searchStock } from '../../utils/stockFunction';

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
      bringStockInfo(stock_id, setStockInfo);
    }
  }, [stock_id]);

  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart(stockInfo.stock_code, setChartData);
    }
    if (stockInfo.stock_id) {
      findInitialLikeStock(stockInfo.stock_id, setIsLiked, setStockLikeList);
    }
  }, [stockInfo]);

  const handleSearch = () => {
    searchStock(search, setSearchResult);
  };

  const handleAddLike = () => {
    addLike(stockInfo.stock_id, stockInfo.stock_name, setStockLikeList);
    setIsLiked(true); // 상태 직접 관리
  };

  const handleRemoveLike = () => {
    removeLike(stockInfo.stock_id, setStockLikeList);
    setIsLiked(false); // 상태 직접 관리
  };

  return (
    <div className="text-black flex-grow bg-white">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">{stockInfo.stock_name}</div>
          <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
        </div>
        <SearchInput
          search={search}
          setSearch={setSearch}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          searchStock={handleSearch}
          navigate={navigate}
        />
      </div>
      <div>
        <ChartBox chartData={chartData} stockInfo={stockInfo} stockLikeList={stockLikeList} />
      </div>
    </div>
  );
}
