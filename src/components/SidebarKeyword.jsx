import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';

export default function SidebarKeyword(props) {
  const [keywordInfo, setKeywordInfo] = useState({});
  const [stockRank, setStockRank] = useState([]);

  useEffect(() => {
    keywordInfo.keyword_id = props.keyword_id
    setKeywordInfo(keywordInfo)
    getStockInfo();
    console.log(keywordInfo)
  }, [props.keyword_id])

  const getStockInfo = async () => {
    try {
      if (keywordInfo?.keyword_id) {
        const response = await keywordApi.getStockRankAboutKeyword(keywordInfo.keyword_id);
        setKeywordInfo({...keywordInfo, keyword: response.data.keyword}) 
        setStockRank(response.data.stock_rankings)
        console.log(response.data)
      } else {
        const response = await keywordApi.getKeywordRank();
        setKeywordRank(response.data);
        
      }
    } catch (err) {
      console.error('기업 랭킹 조회 실패:', err.response?.data?.message || err.message);
      alert('기업 랭킹 조회에 실패했습니다...');
    }
  }

  return (
    <div className="p-5">
      {/** header */}
      <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 py-3">
        {keywordInfo?.keyword_id ? (
          <h2>
            <span className="text-blue-200 text-3xl font-bold">[ </span>
            {keywordInfo.keyword}
            <span className="text-blue-200 text-3xl font-bold"> ]</span> 에서 가장 많이 언급된
          </h2>
        ) : (
          <h2>
            <span className="text-blue-200 text-3xl font-bold">[</span>
            오늘
            <span className="text-blue-200 text-3xl font-bold">]</span> 가장 많이 언급된
          </h2>
        )}
      </div>
      {/** list */}
      <ul className="flex flex-col gap-1">
        {stockRank?.map((el, i) => {
          return (
            <li key={i} className="text-xl font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl">
              <div className="text-2xl text-blue-200 mr-16">{i + 1}</div>
              <div>{el.stock_name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
