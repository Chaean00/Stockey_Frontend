import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowUpIcon, ArrowDownIcon, PlusIcon, HeartIcon } from 'lucide-react';

import ChattingMain from './ChattingMain';

import userApi from '../services/userApi';
import keywordApi from '../services/keywordApi';

import { useLikeContext } from '../utils/likeContext';

export default function Sidebar() {
  // const [userBookmarkList, setUserBookmarkList] = useState([]);
  const [keywordRankingList, setKeywordRankingList] = useState([]);

  const { keywordLikeList: userBookmarkList } = useLikeContext();

  const navigate = useNavigate();

  // 즐겨찾기, 실시간 키워드 랭킹 불러오기
  useEffect(() => {
    // const fetchUserBookmarkList = async () => {
    //   const res = await userApi.getKeywordLike();
    //   console.log('유저 북마크 리스트: ', res.data.userKeywords);
    //   setUserBookmarkList(res.data.userKeywords);
    // };

    const fetchKeywordRankingList = async () => {
      const res = await keywordApi.getKeywordRank();
      console.log('키워드 랭킹 리스트:', res.data.slice(0, 5));
      setKeywordRankingList(res.data.slice(0, 5));
    };

    // fetchUserBookmarkList();
    fetchKeywordRankingList();

    console.log('북마크리스트: ', userBookmarkList);
  }, []);

  const goToIdKeyword = (id) => {
    navigate(`/keyword/${id}`);
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4 flex flex-col gap-8">
      {/* Bookmark Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">즐겨찾기</h2>
          <button className="flex flex-row items-center text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">추가</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {' '}
          {/* 수정된 부분: flex-wrap 추가 */}
          {userBookmarkList?.userKeywords?.map((elm) => (
            <button
              key={elm.id}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-red-200"
              onClick={() => {
                goToIdKeyword(elm.keyword_id);
              }}
            >
              {elm.keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">실시간 키워드 랭킹</h2>
          <button className="flex flex-row items-center text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">더보기</span>
          </button>
        </div>
        <div className="space-y-2">
          <ul>
            {keywordRankingList?.map((el, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-200"
                  onClick={() => {
                    goToIdKeyword(el.keyword_id);
                  }}
                >
                  <div className="flex items-center font-medium">
                    <div className="text-blue-200 w-12">{i + 1}</div>
                    <div>{el.keyword}</div>
                  </div>
                  {/* <span className="text-gray-400 font-medium">{el.count}</span> */}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-gray-900">실시간 채팅방</h2>
        <ChattingMain />
        <button
          className="w-full py-2 text-sm bg-blue-200 text-white rounded-lg hover:text-gray-900"
          onClick={() => navigate('/chat')}
        >
          참여하기
        </button>
      </div>
    </div>
  );
}
