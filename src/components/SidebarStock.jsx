import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';

export default function SidebarStock(props) {
  const [stockInfo, setStockInfo] = useState({});
  const [keywordRank, setKeywordRank] = useState([]);

  useEffect(() => {
    stockInfo.stock_id = props.stock_id;
    setStockInfo(stockInfo);
    getKeywordRank();
  }, [props.stock_id]);

  const getKeywordRank = async () => {
    try {
      if (stockInfo?.stock_id) {
        const response = await keywordApi.getKeywordRankAboutStock(stockInfo.stock_id);
        setStockInfo({ ...stockInfo, stock_name: response.data.stock_name });
        setKeywordRank(response.data.keyword_rankings);
      } else {
        const response = await keywordApi.getKeywordRank();
        setKeywordRank(response.data);
      }
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      alert('키워드 랭킹 조회에 실패했습니다...');
    }
  };

  return (
    <div>
      {/** header */}
      <div>
        {stockInfo?.stock_id ? (
          <h2>{stockInfo.stock_name}에서 가장 많이 언급된 키워드는?</h2>
        ) : (
          <h2>오늘 가장 많이 언급된 키워드는?</h2>
        )}
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
