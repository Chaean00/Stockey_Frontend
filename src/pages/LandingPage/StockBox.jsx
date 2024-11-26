import React, { useEffect, useState } from 'react';
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
    <div className="text-black flex-col bg-white">
      {/** header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-4xl">{stockInfo.stock_name}</div>
          <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
        </div>
        <SearchInput
          setSearch={setSearch} //검색어 update 변수
          searchResult={searchResult} //검색 결과 변수
          setSearchResult={setSearchResult} //검색 결과 update 변수
          searchStock={handleSearch} //검색 시 실행하는 함수
        />
      </div>
      <div className="grid-cols-2 flex">
        {/** list */}
        <div className="p-5">
          <ul className="flex flex-col gap-1">
            {keywordRank?.slice(0, 10).map((el, i) => {
              return (
                <li key={i} className="text-md font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl">
                  <div className=" text-blue-200 mr-16">{i + 1}</div>
                  <div>{el.keyword}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          {/** chart component */}
          <div className={`border rounded-xl p-4 w-full`}>
            <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3">
              <Tab eventKey="D" title="일봉">
                <CandleChart chartData={chartData} width={900} height={500} />
              </Tab>
              <Tab eventKey="W" title="주봉">
                <CandleChart chartData={chartData} width={900} height={500} />
              </Tab>
              <Tab eventKey="M" title="월봉">
                <CandleChartSimple chartData={chartData} width={900} height={500} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
