import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowUpIcon, ArrowDownIcon, PlusIcon, HeartIcon } from 'lucide-react';

import ChattingMain from './ChattingMain';

import userApi from '../services/userApi';
import keywordApi from '../services/keywordApi';

import { useLikeContext } from '../utils/likeContext';

export default function SidebarMain() {
  // const [userBookmarkList, setUserBookmarkList] = useState([]);
  const [keywordRankingList, setKeywordRankingList] = useState([]);
  const { keywordLikeList, setKeywordLikeList } = useLikeContext();
  const { stockLikeList, setStockLikeList } = useLikeContext();

  const navigate = useNavigate();

  // 즐겨찾기, 실시간 키워드 랭킹 불러오기
  useEffect(() => {
    // const fetchUserBookmarkList = async () => {
    //   const res = await userApi.getKeywordLike();
    //   console.log('유저 북마크 리스트: ', res.data.userKeywords);
    //   setUserBookmarkList(res.data.userKeywords);
    // };

    const fetchKeywordRankingList = async () => {
      try {
        const res = await keywordApi.getKeywordRank();
        console.log('키워드 랭킹 리스트:', res.data.slice(0, 5));
        setKeywordRankingList(res.data.slice(0, 5));
      } catch (err) {
        console.error('키워드 랭킹 리스트 가져오기 실패:', err);
      }
    };

    const fetchKeywordBookmarkList = async () => {
      try {
        const res = await userApi.getKeywordLike();
        setKeywordLikeList(res.data);
        // console.log('키워드 즐겨찾기 리스트 가져오가: ', res.data);
      } catch (err) {
        console.error('키워드 즐겨찾기 리스트 가져오기 실패:', err);
      }
    };

    const fetchStockBookmarkList = async () => {
      try {
        const res = await userApi.getStockLike();
        setStockLikeList(res.data.userStocks);
        // console.log('종목 즐겨찾기 리스트 가져오가: ', res.data);
      } catch (err) {
        console.error('종목 즐겨찾기 리스트 가져오기 실패:', err);
      }
    };

    // fetchUserBookmarkList();
    fetchKeywordRankingList();
    fetchKeywordBookmarkList();
    fetchStockBookmarkList();
  }, []);

  const goToIdKeyword = (id) => {
    navigate(`/keyword/${id}`);
  };

  const goToIdStock = (id) => {
    navigate(`/stock/${id}`);
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4 flex flex-col gap-8">
      {/* Keyword Bookmark Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-gray-900">키워드 즐겨찾기</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {' '}
          {/* 수정된 부분: flex-wrap 추가 */}
          {keywordLikeList?.userKeywords?.map((elm) => (
            <button
              key={elm.id}
              className="font-semibold px-3 py-1.5 hover:text-blue-200 bg-white rounded-lg text-sm"
              onClick={() => {
                goToIdKeyword(elm.keyword_id);
              }}
            >
              {elm.keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Bookmark Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-gray-900">종목 즐겨찾기</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {' '}
          {/* 수정된 부분: flex-wrap 추가 */}
          {stockLikeList?.map((elm) => (
            <button
              key={elm.id}
              className="font-semibold px-3 py-1.5 hover:text-blue-200 bg-white rounded-lg text-sm"
              onClick={() => {
                goToIdStock(elm.stock_id);
              }}
            >
              {elm.stock_name}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-gray-900">실시간 키워드 랭킹</h2>
        </div>
        <div className="space-y-2">
          <ul>
            {keywordRankingList?.map((el, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl font-semibold hover:bg-gray-200"
                  onClick={() => {
                    goToIdKeyword(el.keyword_id);
                  }}
                >
                  <div className="flex items-center">
                    <div className="text-blue-200 w-12">{i + 1}</div>
                    <div>{el.keyword}</div>
                  </div>
                  {/* <span className="text-gray-400">{el.count}</span> */}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-extrabold text-gray-900">실시간 채팅방</h2>
        <ChattingMain />
        <button
          className="mt-3 mb-5 w-full py-2 text-sm bg-blue-200 text-white rounded-lg hover:bg-blue-100"
          onClick={() => navigate('/chat')}
        >
          참여하기
        </button>
      </div>
    </div>
  );
}
