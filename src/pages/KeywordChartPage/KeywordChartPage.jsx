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

  // 종목 로고 Path
  const imagePath = `/company_logo/${stockInfo.stock_code}.png`;

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
      <div className="flex flex-row items-center mb-2">
        {/* 종목 로고 이미지 */}
        <img
          src={imagePath}
          alt={`Stock Logo ${stockInfo.stock_code}`}
          onError={(e) => {
            // 이미지 로드 실패 시 대체 이미지 처리
            e.target.src = '/company_logo/default.png';
          }}
          className="w-8 h-8 rounded-xl mr-2"
        />
        <div className="font-extrabold text-2xl">
          {stockInfo?.stock_name || '로딩 중...'} -<span className="text-gray-400"> {stockInfo.stock_code}</span>
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
        <div className="font-bold text-2xl my-3">
          <span className="text-blue-200 text-3xl">[ </span>
          {keywordData?.keyword || '로딩 중...'}
          <span className="text-blue-200 text-3xl"> ]</span> 관련 뉴스에서 주목받은 종목 한눈에 보기
        </div>
        <StockWordCloud data={keywordData.stock_rankings} width={800} height={400} />
      </div>
    </div>
  );
}
