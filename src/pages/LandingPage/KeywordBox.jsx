import React, { useState, useEffect, useRef } from 'react';
import { searchKeyword, setUpKeywordDataAndStockInfo } from '../../utils/keywordFunction';
import { bringStockChart } from '../../utils/stockFunction';
import { findInitialLikeKeyword, keywordAddLike, keywordRemoveLike } from '../../utils/likeFunction';
import keywordApi from '../../services/keywordApi';
import LikeButton from '../../components/LikeButton';
import SearchInput from '../../components/SearchInput';
import { Tab, Tabs } from 'react-bootstrap';
import CandleChart from '../../components/ChartBox/CandleChart';
import CandleChartSimple from '../../components/CandleChartSimple';
import SearchKeywordInput from '../../components/SearchKeywordInput';
import { useNavigate } from 'react-router-dom';

export default function KeywordBox() {
  const [search, setSearch] = useState(''); // 검색어
  const [isLiked, setIsLiked] = useState(false); // 즐겨찾기 여부
  const [searchResult, setSearchResult] = useState([]); // 검색어 결과
  const [chartData, setChartData] = useState([]); // 차트 그릴 데이터
  const [stockInfo, setStockInfo] = useState({});
  const [keywordData, setKeywordData] = useState(''); // 키워드 정보
  const [keywordLikeList, setKeywordLikeList] = useState([]); // 키워드 즐겨찾기 목록
  const [period, setPeriod] = useState('D'); // 일봉 주봉 월봉
  const [chartDataLoaded, setChartDataLoaded] = useState(false); // Lazy Loading 상태 관리
  const chartContainerRef = useRef(null); // 차트 컨테이너 참조
  const [chartSize, setChartSize] = useState({ width: 600, height: 400 }); // 초기값 설정
  const navigate = useNavigate();

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
  
  useEffect(() => {
    const excute = async () => {
      try {
        const response = await keywordApi.getTopKeywrod();
        const topKeywordData = response.data[0]

        await setUpKeywordDataAndStockInfo(topKeywordData.keyword_id, setKeywordData, setStockInfo)
      } catch (error) {
        console.log("데이터 로딩 실패");
      }
    }
    
    excute();
  }, [])

  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart(stockInfo.stock_code, setChartData, period); //주식 정보에서 stock_code, ChartData update useState, 초기 일봉('D')으로 조회
      setChartDataLoaded(true)
    }
    if (stockInfo.stock_id) {
      // keywordData.keyword
      findInitialLikeKeyword(keywordData.keyword, setIsLiked, setKeywordLikeList);
    }
  }, [stockInfo, period])

  const moveToStock = (chart_period) => {
    setChartDataLoaded(false); // Lazy Loading 초기화
    setPeriod(chart_period);
  };
  // 즐겨찾기 추가 핸들링
  const handleAddLike = () => {
    keywordAddLike(keywordData.keyword, setKeywordLikeList)
    setIsLiked(true);
  }

  // 즐겨찾기 삭제 핸들링
  const handleRemoveLike = () => {
    keywordRemoveLike(keywordData.keyword, setKeywordLikeList, keywordData)
    setIsLiked(false);
  }

  // 검색함수 핸들링
  const handleSearch = () => {
    searchKeyword(search, setSearchResult)
  }

  return (
    <div className="text-black_default flex flex-col bg-white">
      {/** Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-2xl">
            <span className="text-3xl font-bold text-blue-200">[ </span>
            {keywordData?.keyword|| '로딩 중...'}
            <span className="text-3xl font-bold text-blue-200"> ]</span>
            <span className="text-gray-600 text-xl hidden lg:inline-block">에 대한 키워드 랭킹</span>
          </div>
          <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike}/>
        </div>
        <SearchKeywordInput
          setSearch={setSearch}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          searchKeyword={handleSearch}
        />
      </div>

      {/** 그리드 레이아웃 */}
      <div className="grid grid-cols-5 gap-1 border-2 rounded-xl">
        {/** 리스트 (1/4 차지) */}
        <div className="col-span-1 p-4 py-5 flex flex-col justify-between">
          <div className="font-semibold text-lg mb-4"> [ {keywordData?.keyword} ] 에서 가장 많이 언급된</div>
          {keywordData?.stock_rankings?.slice(0, 10).map((el, i) => (
            <div key={i} className="flex justify-between hover:bg-gray-100 rounded-xl pl-5" onClick={() => {
              navigate(`stock/${keywordData.stock_rankings[i].id}`);
            }}>
              <div className="text-blue-200 py-1 w-1/3 font-semibold text-lg" >{i + 1}</div>
              <div className="py-1 w-2/3 font-semibold">{el.stock_name}</div>
            </div>
          ))}
        </div>

        {/** 차트 (3/4 차지) */}
        <div ref={chartContainerRef} className="col-span-4 lg:p-4">
          {/** chart */}
          <div>
            <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3 font-semibold">
              <Tab eventKey="D" title="일봉">
                {chartDataLoaded ? (
                  <CandleChart chartData={chartData} width={chartSize.width * 0.98} height={450} />
                ) : (
                  <div>차트 데이터를 로드 중입니다...</div>
                )}
              </Tab>
              <Tab eventKey="W" title="주봉">
                {chartDataLoaded ? (
                  <CandleChart chartData={chartData} width={chartSize.width * 0.98} height={450} />
                ) : (
                  <div>차트 데이터를 로드 중입니다...</div>
                )}
              </Tab>
              <Tab eventKey="M" title="월봉">
                {chartDataLoaded ? (
                  <CandleChartSimple chartData={chartData} width={chartSize.width * 0.98} height={450} />
                ) : (
                  <div>차트 데이터를 로드 중입니다...</div>
                )}
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
