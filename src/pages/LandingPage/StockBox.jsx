import React, { useEffect, useRef, useState } from 'react';
import SearchInput from '../../components/SearchInput'; // 검색 버튼
import LikeButton from '../../components/LikeButton'; // 좋아요 버튼
import { removeLike, addLike, findInitialLikeStock } from '../../utils/likeFunction'; // 즐겨찾기 관련 함수
import { bringStockChart, searchStock } from '../../utils/stockFunction'; // 주식 정보 조회 관련 함수
import { Tabs, Tab } from 'react-bootstrap';
import keywordApi from '../../services/keywordApi';
import ResizeObserver from 'resize-observer-polyfill';
import CandleChart from '../../components/ChartBox/CandleChart';
import CandleChartSimple from '../../components/CandleChartSimple';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function StockBox() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({
    stock_id: 11,
    stock_code: '055550',
    stock_name: '신한지주',
  });
  const [stockLikeList, setStockLikeList] = useState([]);
  const [keywordRank, setKeywordRank] = useState([]);
  const [period, setPeriod] = useState('D');
  const [chartDataLoaded, setChartDataLoaded] = useState(false); // Lazy Loading 상태 관리
  const chartContainerRef = useRef(null); // 차트 컨테이너 참조
  const [chartSize, setChartSize] = useState({ width: 600, height: 400 }); // 초기값 설정

  const navigate = useNavigate();

  // 부모 <div> 크기 변화 감지 및 업데이트
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setChartSize({
          width: width || 600, // 기본값 설정
          height: height ? height - 50 : 400, // 기본값 설정
        });
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
  }, []);

  // 차트 데이터 Lazy Loading
  useEffect(() => {
    if (period && stockInfo.stock_code && !chartDataLoaded) {
      bringStockChart(
        stockInfo.stock_code,
        (data) => {
          if (data && data.length > 0) {
            setChartData(data);
            setChartDataLoaded(true);
          } else {
            console.error('차트 데이터가 비어 있습니다.');
          }
        },
        period,
      );
    }
  }, [period, stockInfo.stock_code, chartDataLoaded]);

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
      setKeywordRank(response.data.keyword_rankings);
      console.log(response.data.keyword_rankings);
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      toast.error('키워드 랭킹 조회에 실패했습니다.');
    }
  };

  // 차트 기간 변경
  const moveToStock = (chart_period) => {
    setChartDataLoaded(false); // Lazy Loading 초기화
    setPeriod(chart_period);
  };

  return (
    <div className="text-black_default flex flex-col bg-white">
      {/** Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div
            className="font-extrabold text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => {
              navigate(`stock/${stockInfo.stock_id}`);
            }}
          >
            <span className="text-3xl font-bold text-blue-200">[ </span>
            {stockInfo.stock_name}
            <span className="text-3xl font-bold text-blue-200"> ]</span>
            <span className="text-gray-600 text-xl hidden lg:inline-block">에 대한 키워드 랭킹</span>
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
      <div className="grid grid-cols-5 gap-1 border-2 rounded-xl">
        {/** 리스트 (1/4 차지) */}
        <div className="col-span-1 p-4 py-5 flex flex-col justify-between">
          <div className="font-semibold text-lg mb-4">{stockInfo.stock_name}에서 가장 많이 언급된</div>
          {keywordRank?.slice(0, 10).map((el, i) => (
            <div key={i} className="flex justify-between hover:bg-gray-100 rounded-xl pl-5">
              <div className="text-blue-200 py-1 w-1/3 font-semibold text-lg">{i + 1}</div>
              <div className="py-1 w-2/3 font-semibold">{el.keyword}</div>
            </div>
          ))}
        </div>

        {/** 차트 (3/4 차지) */}
        <div ref={chartContainerRef} className="col-span-4 lg:p-4">
          {/** chart */}
          <div className="font-semibold">
            <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3 font-semibold">
              <Tab eventKey="D" title="일봉">
                <CandleChart chartData={chartData} width={chartSize.width * 0.98} height={450} />
              </Tab>
              <Tab eventKey="W" title="주봉">
                <CandleChart chartData={chartData} width={chartSize.width * 0.98} height={450} />
              </Tab>
              <Tab eventKey="M" title="월봉">
                <CandleChartSimple chartData={chartData} width={chartSize.width * 0.98} height={450} />
              </Tab>
            </Tabs>
          </div>

          {/** chart data */}
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            {chartData.length > 0 ? (
              <div>
                <ul className="flex flex-wrap items-center justify-between text-sm font-semibold">
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">날짜</span>
                    <span>{chartData[chartData.length - 1]?.date || 'N/A'}</span>
                  </li>
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">시가</span>
                    <span>{chartData[chartData.length - 1]?.open || 'N/A'}</span>
                  </li>
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">고가</span>
                    <span>{chartData[chartData.length - 1]?.high || 'N/A'}</span>
                  </li>
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">저가</span>
                    <span>{chartData[chartData.length - 1]?.low || 'N/A'}</span>
                  </li>
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">종가</span>
                    <span>{chartData[chartData.length - 1]?.close || 'N/A'}</span>
                  </li>
                  <li className="flex items-center gap-5 border-l-2 border-gray-300 pl-4">
                    <span className="text-gray-500">거래량</span>
                    <span>{chartData[chartData.length - 1]?.volume || 'N/A'}</span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
