import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowUpIcon, ArrowDownIcon, PlusIcon, HeartIcon } from 'lucide-react';

import ChattingMain from './ChattingMain';

import userApi from '../services/userApi';
import keywordApi from '../services/keywordApi';

const categories = [
  '로봇',
  '인공지능',
  'AI',
  '영업이익',
  '초전도체',
  '트럼프',
  '일론 마스크',
  '자동차',
  '전기차',
  '항공',
  '대한항공',
  '아시아나항공',
  '제주항공',
];

const rankings = [
  { name: '로봇', change: 2, trend: 'up' },
  { name: 'AI', change: 0, trend: 'none' },
  { name: '초전도체', change: 2, trend: 'down' },
  { name: '공매도', change: 3, trend: 'up' },
  { name: '전쟁', change: 1, trend: 'up' },
];

const chatMessages = [
  {
    user: 'User 2',
    time: '0분 전',
    message:
      '맞아요. 금리가 오르면 예금 금리도 함께 올라서 현금을 예금으로 이동시키는 경우가 늘 수 있죠. 개인적으로는 금융주를 주가로 매수할지 고민 중인데, 과도한 금리 인상이 경기 침체로 이어질 가능성도 있어서 조심스럽습니다. 최근의 금리 인상 흐름이 얼마나 지속될지 예측하기가 어렵네요.',
  },
  {
    user: 'User 3',
    time: '0분 전',
    message:
      '금리 인상이 계속 이어진다면, 결국 개인 소비가 위축되면서 기업들의 매출도 감소할 가능성이 높아질 것 같아요. 이로 인해 소비재 기업들이 타격을 받을 수 있는데, 반대로 저축 성향이 강해지면서 금융권의 수익성이 올라갈 수도 있겠죠. 다들 이런 시기에 어떤 업종에 주목하고 계신가요?',
  },
];

export default function Sidebar() {
  const [userBookmarkList, setUserBookmarkList] = useState([]);
  const [keywordRankingList, setKeywordRankingList] = useState([]);

  const navigate = useNavigate();

  // 즐겨찾기, 실시간 키워드 랭킹 불러오기
  useEffect(() => {
    const fetchUserBookmarkList = async () => {
      const res = await userApi.getKeywordLike();
      console.log('유저 북마크 리스트: ', res.data.userKeywords);
      setUserBookmarkList(res.data.userKeywords);
    };

    const fetchKeywordRankingList = async () => {
      const res = await keywordApi.getKeywordRank();
      console.log('키워드 랭킹 리스트:', res.data.slice(0, 5));
      setKeywordRankingList(res.data.slice(0, 5));
    };

    fetchUserBookmarkList();
    fetchKeywordRankingList();
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
          {userBookmarkList.map((elm) => (
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
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">실시간 채팅방</h2>
        <div className="space-y-4 overflow-y-auto max-h-60">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="font-medium text-gray-900">{msg.user}</span>
                  <span className="text-sm text-gray-500">{msg.time}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <HeartIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
        <button className="w-full py-3 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg">
          채팅에 참여하시면 의견을 남길 수 있어요
        </button>
      </div>
    </div>
  );
}
