import React, { useEffect, useState, useRef } from 'react';
import stockApi from '../../services/stockApi';
import ChartBox from '../../components/ChartBox/ChartBox';
import { AiFillHeart } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import userApi from '../../services/userApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function StockChartPage() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false); // 초기 좋아요 상태
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  const [stockLikeList, setStockLikeList] = useState([]);
  const { stock_id } = useParams();
  const navigate = useNavigate();
  const resultRef = useRef(null);

  // SearchResult 바깥을 클릭했을 때 닫히도록 설정
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultRef.current && !resultRef.current.contains(event.target)) {
        setSearchResult([]); // searchResult 초기화
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (stock_id) {
      bringStockInfo(stock_id);
    }
  }, [stock_id]);

  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart('D');
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

  const bringStockChart = async (chart_period) => {
    try {
      const response = await stockApi.getStockChart(stockInfo.stock_code, chart_period);
      setChartData(response.data);
    } catch (error) {
      console.error('차트 조회 실패:', error.response?.data?.message || error.message);
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
      // 바로 stockLikeList에서 제거
      setStockLikeList((prevList) => prevList.filter((like) => like.stock_id !== stockInfo.stock_id));
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
    }
  };

  const addLike = async () => {
    try {
      await userApi.addStockLike({ stock_id: stockInfo.stock_id, alarm_status: false });
      setIsLiked(true);
      // 바로 stockLikeList에 추가
      setStockLikeList((prevList) => [...prevList, { stock_id: stockInfo.stock_id, stock_name: stockInfo.stock_name }]);
    } catch (error) {
      console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="text-black flex-grow bg-white">
      {/** header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">{stockInfo.stock_name}</div>
          <AiFillHeart
            className={`text-3xl cursor-pointer ${isLiked ? 'text-red-100' : 'text-gray-200'} `}
            onClick={() => {
              if (isLiked) {
                removeLike();
              } else {
                addLike();
              }
            }}
          />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
            <input
              className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-500 text-black"
              maxLength={16}
              placeholder="원하는 종목을 검색하세요"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchStock();
                }
              }}
            />
            <FaSearch
              className="text-gray-500 ml-3"
              onClick={() => {
                searchStock();
              }}
            />
          </div>

          <ul
            ref={resultRef}
            className={`absolute z-10 left-0 w-full bg-white rounded-md shadow-md max-h-60 overflow-y-auto ${
              searchResult?.length > 0 ? 'border border-gray-200' : ''
            }`}
          >
            {searchResult?.length > 0
              ? searchResult.map((el, i) => (
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-blue-50 border-b last:border-none flex justify-between"
                    key={i}
                    onClick={() => {
                      navigate(`/stock/${el.id}`);
                      setSearchResult([]); // searchResult 초기화
                    }}
                  >
                    <div className="font-medium text-black">{el.stock_name}</div>
                    <div className="text-sm text-blue-100">{el.code}</div>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      {/** main */}
      <div>
        <ChartBox
          chartData={chartData}
          stockInfo={stockInfo}
          stockLikeList={stockLikeList}
          bringStockChart={bringStockChart}
        />
      </div>
    </div>
  );
}
