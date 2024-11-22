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
    <div className="p-5">
      {/** header */}
      <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 py-3">
        {stockInfo?.stock_id ? (
          <h2>
            <span className="text-blue-200 text-3xl font-bold">[ </span>
            {stockInfo.stock_name}
            <span className="text-blue-200 text-3xl font-bold"> ]</span> 에서 가장 많이 언급된
          </h2>
        ) : (
          <h2>오늘 가장 많이 언급된</h2>
        )}
      </div>
      {/** list */}
      <ul className="flex flex-col gap-1">
        {keywordRank?.map((el, i) => {
          return (
            <li key={i} className="text-xl font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl">
              <div className="text-2xl text-blue-200 mr-16">{i + 1}</div>
              <div>{el.keyword}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
