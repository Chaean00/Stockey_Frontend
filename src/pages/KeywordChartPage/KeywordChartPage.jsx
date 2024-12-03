import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeButton from '../../components/LikeButton';
import { findInitialLikeKeyword, keywordAddLike, keywordRemoveLike } from '../../utils/likeFunction';
import { searchKeyword, setUpKeywordDataAndStockInfo } from '../../utils/keywordFunction';
import SearchKeywordInput from '../../components/SearchKeywordInput';
import { bringStockChart } from '../../utils/stockFunction';
import KeywordChartBox from '../../components/ChartBox/KeywordChartBox';
import { useLikeContext } from '../../utils/likeContext';
import StockWordCloud from '../../components/StockWordCloud';

export default function KeywordChartPage() {
  const { keyword_id } = useParams();
  const [chartData, setChartData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState();
  const [period, setPeriod] = useState('D');

  // 키워드 데이터 가져오기
  useEffect(() => {
    setUpKeywordDataAndStockInfo(keyword_id, setKeywordData, setStockInfo);
  }, [keyword_id]);

  const {
    keywordLikeList,
    setKeywordLikeList,
    isLiked,
    setIsLiked,
    keywordData,
    setKeywordData,
    stockInfo,
    setStockInfo,
  } = useLikeContext();

  // 키워드 데이터 가져오기
  // useEffect(() => {
  //   setUpKeywordDataAndStockInfo(keyword_id, setKeywordData, setStockInfo);
  //   // console.log("KeywordData => ", keywordData)
  //   // console.log("StockINFO => ", stockInfo)
  //   console.log('12132312 =>', keywordLikeList);
  // }, [keyword_id]);

  useEffect(() => {
    if (stockInfo.stock_code) {
      bringStockChart(stockInfo.stock_code, setChartData, period); //주식 정보에서 stock_code, ChartData update useState, 초기 일봉('D')으로 조회
    }
    // 사이드바 즐겨찾기 동기화를 위해 likeContext.jsx로 상태 관리
    // if (stockInfo.stock_id) {
    //   // keywordData.keyword
    //   findInitialLikeKeyword(keywordData.keyword, setIsLiked, setKeywordLikeList);
    // }
  }, [stockInfo]);

  // 즐겨찾기 추가 핸들링
  const handleAddLike = () => {
    keywordAddLike(keywordData.keyword, setKeywordLikeList);
    setIsLiked(true);
  };

  // 즐겨찾기 삭제 핸들링
  const handleRemoveLike = () => {
    keywordRemoveLike(keywordData.keyword, setKeywordLikeList, keywordData);
    setIsLiked(false);
  };

  // 검색함수 핸들링
  const handleSearch = () => {
    searchKeyword(search, setSearchResult);
  };

  return (
    <div className="text-black_default flex-grow bg-white">
      {/** header */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-4xl">{keywordData?.keyword || '로딩 중...'}</div>
            <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
          </div>
          <SearchKeywordInput
            setSearch={setSearch}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            searchKeyword={handleSearch}
          />
        </div>
        {/** 종목명 및 종목 코드 */}
        <div className=" gap-5 items-center mb-2">
          <div className="font-bold text-2xl">
            {stockInfo?.stock_name || '로딩 중...'} <span className="text-gray-400"> {stockInfo.stock_code}</span>
          </div>
          <div className=" flex items-center">
            <div className="font-semibold text-gray-500">
              키워드 [{keywordData?.keyword || '로딩 중...'}] 관련 뉴스에서 종목 [
              {stockInfo?.stock_name || '로딩 중...'}]이/가 가장 많이 언급되었어요
            </div>
            <div className="ml-3 text-sm bg-gray-100 p-1 rounded-md px-2">오늘 8시 기준</div>
          </div>
        </div>
      </div>

      <div>
        <KeywordChartBox
          chartData={chartData} // 차트 데이터
          setChartData={setChartData}
          stockInfo={stockInfo} // 주식 정보 {stock_id, stock_code, stock_name}
          keywordLikeList={keywordLikeList} // 키워드 즐겨찾기 List
          bringStockChart={bringStockChart} // 주식 차트 데이터 조회
          period={period} // 일봉, 주봉, 월봉 (default : 일봉)
          setPeriod={setPeriod}
        />
      </div>
      <div className="mt-5">
        <div className="font-bold text-xl my-3">
          <span className="text-blue-200 text-2xl">[ </span>
          {keywordData?.keyword || '로딩 중...'}
          <span className="text-blue-200 text-2xl"> ]</span> 관련 뉴스에서 주목받은 종목 한눈에 보기
        </div>
        <StockWordCloud data={keywordData.stock_rankings} width={800} height={400} />
      </div>
    </div>
  );
}
