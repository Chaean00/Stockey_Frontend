import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';
import stockApi from '../services/stockApi';
import { useNavigate } from 'react-router-dom';

export default function SidebarKeyword(props) {
  const [keywordInfo, setKeywordInfo] = useState({});
  const [stockRank, setStockRank] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    keywordInfo.keyword_id = props.keyword_id;
    setKeywordInfo(keywordInfo);
    getStockInfo();
  }, [props.keyword_id]);

  const getStockInfo = async () => {
    try {
      if (keywordInfo?.keyword_id) {
        const response = await keywordApi.getStockRankAboutKeyword(keywordInfo.keyword_id);
        setKeywordInfo({ ...keywordInfo, keyword: response.data.keyword });
        setStockRank(response.data.stock_rankings);
      } else {
        const response = await stockApi.getStcokRankByUserLike();
        setStockRank(response.data)
      }
    } catch (err) {
      console.error('기업 랭킹 조회 실패:', err.response?.data?.message || err.message);
      alert('기업 랭킹 조회에 실패했습니다...');
    }
  };

  return (
    <div className="p-3">
      {/** header */}
      <div className="lg:text-lg mb-3 font-extrabold w-full border-b border-gray-300 py-3">
        {keywordInfo?.keyword_id ? (
          <h2>
            <span className="text-blue-200 text-xl font-bold">[ </span>
            {keywordInfo.keyword}
            <span className="text-blue-200 text-xl font-bold"> ]</span> 에서 가장 많이 언급된
          </h2>
        ) : (
          <h2>오늘 가장 많이 언급된</h2>
        )}
      </div>
      {/** list */}
      {keywordInfo?.keyword_id ? (
        <ul className="flex flex-col gap-1">
          {stockRank?.map((el, i) => {
            console.log('특정', el);
            return (
              <li
                key={i}
                className="text-md font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl justify-between"
                onClick={() => {
                  navigate(`stock/${el.id}`);
                }}
              >
                <div className=" text-blue-200 w-1/3">{i + 1}</div>
                <div className="w-2/3">{el.stock_name}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="flex flex-col gap-1 p-2">
          {stockRank?.map((el, i) => {
            console.log('메인', el);
            return (
              <li
                key={i}
                className="text-md font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl justify-between"
                onClick={() => {
                  navigate(`stock/${el.stock_id}`);
                }}
              >
                <div className=" text-blue-200 w-1/3">{i + 1}</div>
                <div className="w-2/3">{el.Stock.stock_name}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
