import React, { useEffect, useState } from 'react';
import SidebarStock from '../../components/SidebarStock';
import stockApi from '../../services/stockApi';
import ChartBox from '../../components/ChartBox/ChartBox';
import { AiFillHeart } from 'react-icons/ai';

import { FaSearch } from 'react-icons/fa';
import userApi from '../../services/userApi';

export default function StockChartPage() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false); // 초기 좋아요 상태
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({
    stock_id: 311,
    stock_name: '신한지주',
    stock_code: '055550',
  });

  useEffect(() => {
    bringStockChart();
    findInitialLikeStock();
  }, []);

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
      response.data.userStocks.map((like) => {
        if (like.stock_id == stockInfo.stock_id) {
          setIsLiked(true);
        }
      });
    } catch (error) {
      console.error('즐겨찾기 불러오기 실패:', error.response?.data?.message || error.message);
    }
  };

  const removeLike = async () => {
    //즐겨찾기에서 삭제
    const stock_id = stockInfo.stock_id;
    try {
      const response = await userApi.removeStockLike({ stock_id: stock_id });
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
    }
  };
  const addLike = async () => {
    //즐겨찾기에 추가
    const stock_id = stockInfo.stock_id;
    try {
      const response = await userApi.addStockLike({ stock_id: stock_id, alarm_status: false });
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
              setIsLiked(!isLiked);
              if (isLiked) {
                removeLike();
              } else {
                addLike();
              }
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
            <input
              className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-500 text-gray-700"
              maxLength={16}
              placeholder="원하는 종목을 검색하세요"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchStock();
                }
              }}
            />
            <FaSearch className="text-gray-500 ml-3" />
          </div>

          <ul>
            {searchResult?.map((el, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    setStockInfo(el);
                    bringStockChart();
                  }}
                >
                  <div>{el.stock_name}</div>
                  <div>{el.stock_code}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/** main */}
      <div>
        <ChartBox chartData={chartData} stockInfo={stockInfo} />
      </div>
    </div>
  );
}
