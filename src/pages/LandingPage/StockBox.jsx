import React, { useEffect, useRef, useState } from 'react';
import SearchInput from '../../components/SearchInput'; //검색 버튼
import LikeButton from '../../components/LikeButton'; //좋아요 버튼
import { removeLike, addLike, findInitialLikeStock } from '../../utils/likeFunction'; //즐겨찾기 관련 함수
import { bringStockChart, searchStock } from '../../utils/stockFunction'; //주식 정보 조회 관련 함수
import CandleChart from '../../components/ChartBox/CandleChart';
import CandleChartSimple from '../../components/CandleChartSimple';
import { Tabs, Tab } from 'react-bootstrap';
import keywordApi from '../../services/keywordApi';

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
  const chartContainerRef = useRef(null); // 부모 <div> 참조
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 부모 <div> 크기 계산
    const resizeChart = () => {
      if (chartContainerRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current;
        setChartSize({ width: clientWidth, height: clientHeight - 50 }); // 여백 고려
      }
    };

    // 초기 크기 설정 및 윈도우 리사이즈 이벤트 등록
    resizeChart();
    window.addEventListener('resize', resizeChart);

    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  useEffect(() => {
    if (stockInfo.stock_code) {
      //주식 차트 조회
      bringStockChart(stockInfo.stock_code, setChartData, period); //주식 정보에서 stock_code, ChartData update useState, 초기 일봉('D')으로 조회
    }
    if (stockInfo.stock_id) {
      //즐겨찾기 리스트 및 현재 종목 즐겨찾기 상태 조회
      findInitialLikeStock(stockInfo.stock_id, setIsLiked, setStockLikeList); //주식 정보에서 stock_id, 현재 주식에 대한 즐겨찾기 상태 업데이트 변수, 즐겨찾기 리스트 상태 업데이트 변수
      getKeywordRank();
    }
  }, []);

  //검색 컴포넌트 실행 시, 검색 함수
  const handleSearch = () => {
    searchStock(search, setSearchResult); //(검색어, 검색 결과 상태 업데이트 변수) => 이 부분은 키워드 검색 api로 대체해서 사용해주세요
  };

  //종목 즐겨찾기 추가 함수
  const handleAddLike = () => {
    addLike(stockInfo.stock_id, stockInfo.stock_name, setStockLikeList);
    setIsLiked(true); // 상태 직접 관리
  };

  //종목 즐겨찾기 삭제 함수
  const handleRemoveLike = () => {
    removeLike(stockInfo.stock_id, setStockLikeList);
    setIsLiked(false); // 상태 직접 관리
  };

  const getKeywordRank = async () => {
    try {
      const response = await keywordApi.getKeywordRankAboutStock(stockInfo.stock_id);
      setStockInfo({ ...stockInfo, stock_name: response.data.stock_name });
      setKeywordRank(response.data.keyword_rankings);
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      alert('키워드 랭킹 조회에 실패했습니다...');
    }
  };

  const moveToStock = (chart_period) => {
    setPeriod(chart_period);
  };

  return (
    <div className="text-black_default flex flex-col bg-white">
      {/** header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">
            {stockInfo.stock_name}
            <span className="text-gray-500 text-2xl">에 대한 키워드 랭킹</span>
          </div>
          <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
        </div>
        <SearchInput
          setSearch={setSearch} // 검색어 update 변수
          searchResult={searchResult} // 검색 결과 변수
          setSearchResult={setSearchResult} // 검색 결과 update 변수
          searchStock={handleSearch} // 검색 시 실행하는 함수
        />
      </div>

      {/** 그리드 레이아웃 */}
      <div className="grid grid-cols-4 gap-4">
        {/** 리스트 (1/4 차지) */}
        <div className="col-span-1 border rounded-xl p-5">
          <table className="w-full">
            <tbody>
              {keywordRank?.slice(0, 10).map((el, i) => {
                return (
                  <tr key={i} className="text-md font-extrabold text-gray-700 hover:bg-gray-100 rounded-lg">
                    <td className="text-blue-200 py-2 px-3 w-1/3">{i + 1}</td>
                    <td className="py-2 px-3 w-2/3">{el.keyword}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/** 차트 (3/4 차지) */}
        <div ref={chartContainerRef} className="col-span-3 border rounded-xl p-4">
          <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3">
            <Tab eventKey="D" title="일봉">
              <CandleChart chartData={chartData} width={chartSize.width * 0.95} height={600} />
            </Tab>
            <Tab eventKey="W" title="주봉">
              <CandleChart chartData={chartData} width={chartSize.width * 0.95} height={600} />
            </Tab>
            <Tab eventKey="M" title="월봉">
              <CandleChartSimple chartData={chartData} width={chartSize.width * 0.95} height={600} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
