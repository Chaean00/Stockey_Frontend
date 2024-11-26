import React, { useEffect, useRef, useState } from 'react';
import SearchInput from '../../components/SearchInput'; // 검색 버튼
import LikeButton from '../../components/LikeButton'; // 좋아요 버튼
import { removeLike, addLike, findInitialLikeStock } from '../../utils/likeFunction'; // 즐겨찾기 관련 함수
import { bringStockChart, searchStock } from '../../utils/stockFunction'; // 주식 정보 조회 관련 함수
import CandleChart from '../../components/ChartBox/CandleChart';
import CandleChartSimple from '../../components/CandleChartSimple';
import { Tabs, Tab } from 'react-bootstrap';
import keywordApi from '../../services/keywordApi';
import ResizeObserver from 'resize-observer-polyfill';

export default function StockBox() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({
    stock_id: 311,
    stock_code: '055550',
    stock_name: '신한지주',
  });
  const [stockLikeList, setStockLikeList] = useState([]);
  const [keywordRank, setKeywordRank] = useState([]);
  const [period, setPeriod] = useState('D');
  const chartContainerRef = useRef(null); // 차트 컨테이너 참조
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  // 부모 <div> 크기 변화 감지 및 업데이트
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setChartSize({ width, height: height - 50 }); // 여백 고려
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 즐겨찾기 및 키워드 랭킹 초기화
  useEffect(() => {
    if (stockInfo.stock_id) {
      findInitialLikeStock(stockInfo.stock_id, setIsLiked, setStockLikeList);
      getKeywordRank();
    }
  }, [stockInfo.stock_id]);

  // 차트 데이터 가져오기
  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart(stockInfo.stock_code, setChartData, period);
    }
  }, [stockInfo.stock_code, period]);

  // 검색 실행
  const handleSearch = () => {
    searchStock(search, setSearchResult);
  };

  // 즐겨찾기 추가
  const handleAddLike = () => {
    addLike(stockInfo.stock_id, stockInfo.stock_name, setStockLikeList);
    setIsLiked(true);
  };

  // 즐겨찾기 삭제
  const handleRemoveLike = () => {
    removeLike(stockInfo.stock_id, setStockLikeList);
    setIsLiked(false);
  };

  // 키워드 랭킹 가져오기
  const getKeywordRank = async () => {
    try {
      const response = await keywordApi.getKeywordRankAboutStock(stockInfo.stock_id);
      setStockInfo({ ...stockInfo, stock_name: response.data.stock_name });
      setKeywordRank(response.data.keyword_rankings);
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      alert('키워드 랭킹 조회에 실패했습니다.');
    }
  };

  // 차트 기간 변경
  const moveToStock = (chart_period) => {
    setPeriod(chart_period);
  };

  return (
    <div className="text-black_default flex flex-col bg-white">
      {/** Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">
            {stockInfo.stock_name}
            <span className="text-gray-500 text-2xl">에 대한 키워드 랭킹</span>
          </div>
          <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
        </div>
        <SearchInput
          setSearch={setSearch}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          searchStock={handleSearch}
        />
      </div>

      {/** 그리드 레이아웃 */}
      <div className="grid grid-cols-5 gap-4 border rounded-xl">
        {/** 리스트 (1/4 차지) */}
        <div className="col-span-1 p-4 flex flex-col justify-center gap-2">
          {keywordRank?.slice(0, 10).map((el, i) => (
            <div key={i} className="flex justify-between hover:bg-gray-100 rounded-xl pl-6">
              <div className="text-blue-200 py-2 px-3 w-1/3 font-semibold text-lg">{i + 1}</div>
              <div className="py-2 px-3 w-2/3 font-semibold">{el.keyword}</div>
            </div>
          ))}
        </div>

        {/** 차트 (3/4 차지) */}
        <div ref={chartContainerRef} className="col-span-4 p-4">
          <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3">
            <Tab eventKey="D" title="일봉">
              <CandleChart chartData={chartData} width={chartSize.width * 0.95} height={450} />
            </Tab>
            <Tab eventKey="W" title="주봉">
              <CandleChart chartData={chartData} width={chartSize.width * 0.95} height={450} />
            </Tab>
            <Tab eventKey="M" title="월봉">
              <CandleChartSimple chartData={chartData} width={chartSize.width * 0.95} height={450} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
