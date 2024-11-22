import React, { useEffect, useState } from 'react';
import SidebarKeyword from '../../components/SidebarKeyword';
import { useParams } from 'react-router-dom';
import keywordApi from '../../services/keywordApi';
import stockApi from '../../services/stockApi';
import CandleChart from '../../components/ChartBox/CandleChart';

export default function KeywordChartPage() {
  const { keywordId } = useParams();
  // console.log(keywordId)
  // 검색할 데이터
  const [search, setSearch] = useState('');
  // 검색 버튼을 눌렀을 때의 결과 (searchValue로 시작하는 키워드 추천)
  const [searchResult, setSearchResult] = useState('');
  // 차트 데이터
  const [chartData, setChartData] = useState([]);
  // 키워드 데이터
  const [keywordData, setKeywordData] = useState({});

  // 차트 데이터 가져오기
  const getChartData = async () => {
    const res = stockApi.getStockChart(keywordData.stock_rankings[0].code)
    setChartData(res.data)
  }

  useEffect(() => {
    // getChartData();
  }, [])

  return (
    <div>
      {/** header */}
      <div>
        <h2>{keywordData.keyword}</h2>
        <div>
          <input placeholder="원하는 키워드를 검색해보세요" onChange={(e) => setSearch(e.target.value)} />
          <button>검색</button>
        </div>
      </div>

      {/** main */}
      <div>
        {/* <CandleChart chartData={chartData} /> */}
      </div>
    </div>
  );
}
