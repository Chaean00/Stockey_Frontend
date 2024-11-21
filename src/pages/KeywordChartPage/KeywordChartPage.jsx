import React, { useEffect, useState } from 'react';
import SidebarKeyword from '../../components/SidebarKeyword';
import { useParams } from 'react-router-dom';
import keywordApi from '../../services/keywordApi';

export default function KeywordChartPage() {
  const { keywordId } = useParams();
  // console.log(keywordId)
  // 검색할 데이터
  const [search, setSearch] = useState('');
  // 검색 버튼을 눌렀을 때의 결과 (searchValue로 시작하는 키워드 추천)
  const [searchResult, setSearchResult] = useState('');
  // 차트 데이터
  const [chartData, setChartData] = useState([]);
  const [keywordData, setKeywordData] = useState({});

  // 키워드 기준 종목의 랭킹 조회
  const getStockDataByKeyword = async () => {
    try {
      const res = await keywordApi.getStockRankAboutKeyword(keywordId);
      setKeywordData(res.data);
    } catch (err) {
      console.error('키워드 조회 실패:', err.response?.data?.message || err.message);
      alert('키워드 조회 실패');
    }
  };

  // 차트 데이터 가져오기
  const getChartData = async () => {
    try {
      asdasd
    } catch (error) {
      console.error("55")
    }
  }

  useEffect(() => {
    console.log('keywordId:', keywordId);
    if (keywordId) {
      getStockDataByKeyword();
      console.log(keywordData)
    }
  }, [keywordId]);

  useEffect(() => {
    if (keywordData) {
      console.log('keywordData updated:', keywordData);  // keywordData가 업데이트 되었을 때 실행
    }
  }, [keywordData]);  // keywordData가 변경될 때마다 실행

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

      {/* side bar */}
      <div>
        {/* {keywordId && keywordData && <SidebarKeyword keywordData={keywordData} />} */}
      </div>

        {/** main */}
        <div>
          <div>주식 차트</div>
          <div>주식 차트의 info</div>
      </div>
    </div>
  );
}
