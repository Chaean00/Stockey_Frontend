import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';


export default function SidebarKeyword(props) {
  const [stockRank, setStockRank] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const getStockRank = async () => {
    const res = await keywordApi.getStockRankAboutKeyword(props.keywordData.keyword_id);
    setStockRank(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getStockRank();
      console.log(props.keywordData)
    }
    fetchData();
  }, [isLoading]);

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
