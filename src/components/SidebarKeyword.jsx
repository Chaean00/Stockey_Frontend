import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';


export default function SidebarKeyword(props) {
  const [stockRank, setStockRank] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const getStockRank = async () => {
    try {
      const res = await keywordApi.getStockRankAboutKeyword(props.keywordData.keyword_id);
      setStockRank(res.data);
      setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태 false로 설정
    } catch (err) {
      console.error('랭킹 조회 실패:', err.response?.data?.message || err.message);
      alert('랭킹 조회에 실패했습니다...');
      setIsLoading(false); // 에러 발생 시에도 로딩 상태를 false로 설정
    }
  };

  useEffect(() => {
    getStockRank();
  }, [props.keywordData.keyword_id]);

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 보여줄 내용
  }

  return (
    <div>
      {/** header */}
      <div>
        <h2>{stockRank.keyword}이 가장 많이 언급된 종목은?</h2>
      </div>
      {/** list */}
      <ul>
        {stockRank.stock_rankings.map((value, index) => (
          <li key={index+1}>{index+1}. {value.stock_name}</li>
        ))}
      </ul>
    </div>
  );
}
