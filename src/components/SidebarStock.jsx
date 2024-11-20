import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';

export default function SidebarStock(props) {
  const [keywordRank, setKeywordRank] = useState([]);

  useEffect(() => {
    getKeywordRank();
    console.log(props.stockInfo.stock_id);
  }, [props.stockInfo.stock_id]);

  const getKeywordRank = async () => {
    try {
      const response = await keywordApi.getKeywordRankAboutStock(props.stockInfo.stock_id);
      setKeywordRank(response.data.keyword_rankings);
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      alert('키워드 랭킹 조회에 실패했습니다...');
    }
  };

  return (
    <div>
      {/** header */}
      <div>
        <h2>{props.stockInfo.stock_name}에서 가장 많이 언급된 키워드는?</h2>
      </div>
      {/** list */}
      <ul>
        {keywordRank?.map((el, i) => {
          return <li key={i}>{el.keyword}</li>;
        })}
      </ul>
    </div>
  );
}
