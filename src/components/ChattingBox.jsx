import React, { useRef, useEffect, useState } from 'react';
import MessageInput from './ChattingInput';
import { ChevronDown, Heart } from 'lucide-react';

import { socket } from '../pages/ChattingPage/ChattingPage';
import chatApi from '../services/chatApi';

export default function ChattingBox({
  // messages,
  messages: initialMessages, // 초기 메시지를 전달받음
  setMessages,
  username,
  roomId,
}) {
  const messageContainerRef = useRef(null);

  // 드롭 다운 상태 관리
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림/닫힘 상태
  const [selectedOption, setSelectedOption] = useState('최신순'); // 선택된 옵션
  const [sortedMessages, setSortedMessages] = useState(initialMessages); // 정렬된 메시지 상태 관리

  // 옵션 목록
  const options = ['최신순', '좋아요순'];

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  // messages와 selectedOption 상태를 기반으로 메시지 정렬
  useEffect(() => {
    const sorted = [...initialMessages].sort((a, b) => {
      if (selectedOption === '최신순') {
        return new Date(a.created_at) - new Date(b.created_at); // 최신순: 최근 시간 우선
      } else if (selectedOption === '좋아요순') {
        return a.totalLikes - b.totalLikes; // 좋아요순: 좋아요 개수 우선
      }
      return 0;
    });

    setSortedMessages(sorted);
  }, [initialMessages, selectedOption]);

  // 좋아요 핸들러
  const handleLike = async (e, comment) => {
    e.preventDefault();

    try {
      // 좋아요가 눌린 상태면
      if (comment.likedByUser) {
        // 좋아요 취소 API 호출
        await chatApi.unlikeMessage(comment.id);

        // 좋아요 취소 소켓 이벤트 전송
        socket.emit('unlikeMessage', {
          messageId: comment.id,
          roomId: roomId,
        });

        // 좋아요 표시 본인 로컬에만 반영
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === comment.id ? { ...msg, likedByUser: false } : msg)),
        );
      } else {
        // 좋아요가 눌리지 않은 상태면
        // 좋아요 추가 API 호출
        await chatApi.likeMessage(comment.id);

        // 좋아요 추가 소켓 이벤트 전송
        socket.emit('likeMessage', {
          messageId: comment.id,
          roomId: roomId,
        });

        // 좋아요 표시 본인 로컬에만 반영
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === comment.id ? { ...msg, likedByUser: true } : msg)),
        );
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      if (error.response.data.message === 'Authorization Null') {
        alert('로그인 후 사용해 주세요.');
      }
    }
  };

  // 스크롤 자동 이동 함수
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // scrollHeight가 변경될 때 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages.length, sortedMessages]);

  // 시간 format 수정
  function formatDate(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = (now - past) / 1000; // 초 단위 차이

    if (diff < 60) {
      return `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`;
    } else {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return past.toLocaleDateString('ko-KR', options);
    }
  }

  // 아이콘 색상 설정
  function stringToPastelColor(nickname) {
    // 해시 함수: 간단한 해시 값을 계산
    function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // 32비트 정수로 변환
      }
      return Math.abs(hash);
    }

    const hash = hashString(nickname);

    // Hue는 0~360 범위, Saturation과 Lightness는 고정 (파스텔톤)
    const hue = hash % 360; // 360도 범위에서 색상 결정
    const saturation = 70; // 파스텔톤을 위한 적당한 포화도
    const lightness = 80; // 파스텔톤을 위한 밝기

    // HSL 색상을 CSS 형식으로 반환
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-black-500">
      <div className="p-1">
        <div className="flex justify-end mb-2 p-3">
          <div className="relative">
            {/* <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              최신순
              <ChevronDown className="w-4 h-4" />
            </button> */}

            {/* 버튼 */}
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {selectedOption}
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* 드롭다운 목록 */}
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <ul className="py-1">
                  {options.map((option, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          handleOptionSelect(option);
                        }}
                        className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                          selectedOption === option ? 'font-bold' : ''
                        }`}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div
          ref={messageContainerRef}
          className="overflow-y-auto px-3 py-0 space-y-4 h-auto max-h-[calc(100vh-20rem)] md:max-h-[calc(100vh-20rem)] scrollbar-hide"
          // className="flex-grow overflow-y-auto p-3 space-y-4 md:max-h-[calc(100vh-20rem)] max-h-[calc(100vh-10rem)] scrollbar-hide"
        >
          {/* 채팅 메시지 목록 */}
          {sortedMessages.map((comment) => (
            <div key={comment.id} className="flex gap-4 border-b border-black-500 pb-[36px]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  {/* 원 아이콘 */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundColor: stringToPastelColor(comment.nickname),
                      }}
                    >
                      {/* {comment.nickname} */}
                    </div>
                  </div>

                  {/* 닉네임 */}
                  <span className="font-sans font-medium text-[16px]">{comment.nickname}</span>

                  {/* 메시지 시간 */}
                  <span className="text-sm text-gray-500 font-medium pl-3">{formatDate(comment.created_at)}</span>

                  {/* 좋아요 하트 및 개수 */}
                  <div className="flex items-center gap-1">
                    <div
                      className="cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        handleLike(e, comment);
                      }}
                    >
                      {comment.likedByUser ? (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 hover:scale-110 transition-transform" />
                      ) : (
                        <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{comment.totalLikes}</span>
                  </div>
                </div>
                {/* 메시지 내용 */}
                <p className="text-gray-700 font-medium mt-[30px]">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 입력받는 컴포넌트 */}
      <MessageInput roomId={roomId} />
    </div>
  );
}
