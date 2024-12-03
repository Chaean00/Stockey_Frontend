import React, { useEffect, useState } from 'react';
import keywordApi from '../services/keywordApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SidebarStock(props) {
  const [stockInfo, setStockInfo] = useState({});
  const [keywordRank, setKeywordRank] = useState([]);
  const navigate = useNavigate();

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
        const response = await keywordApi.getKeywordLikeRank();
        setKeywordRank(response.data.rankings);
      }
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      toast.error('키워드 랭킹 조회에 실패했습니다...');
    }
  };

  const moveToKeywordPage = async (keyword) => {
    try {
      const response = await keywordApi.searchKeywordByWord(keyword);
      const keyword_id = response.data[0].id;
      navigate(`/keyword/${keyword_id}`);
    } catch (error) {
      console.error('키워드 검색 실패:', error.response?.data?.message || error.message);
      toast.error('키워드 검색에 실패했습니다...');
    }
  };

  return (
    <div className="p-3">
      {/** header */}
      <div className="lg:text-xl mb-3 font-extrabold w-full border-b border-gray-300 py-3">
        {stockInfo?.stock_id ? (
          <h2>
            <span className="text-blue-200 text-xl font-bold">[ </span>
            {stockInfo.stock_name}
            <span className="text-blue-200 text-xl font-bold">
              {' '}
              ]
            </span> 에서 가장 많이 언급된
          </h2>
        ) : (
          <h2>가장 많이 즐겨찾기된 키워드는?</h2>
        )}
      </div>
      {/** list */}
      <ul className="flex flex-col gap-1 p-2">
        {keywordRank?.map((el, i) => {
          return (
            <li
              key={i}
              className="text-md font-semibold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl justify-between cursor-pointer"
              onClick={() => {
                moveToKeywordPage(el.keyword);
              }}
            >
              <div className=" text-blue-200 w-1/3">{i + 1}</div>
              <div className="w-2/3">{el.keyword}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
