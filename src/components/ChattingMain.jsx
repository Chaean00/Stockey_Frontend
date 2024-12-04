import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import { socket } from '../pages/ChattingPage/ChattingPage';

import chatApi from '../services/chatApi';

export default function ChattingMain() {
  const roomId = 1; // 전체 채팅방 id
  const [messages, setMessages] = useState([]);

  const messageContainerRef = useRef(null);

  // 방 입장
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    return () => {
      // 퇴장 조건 Layout에 따로 설정할 예정
      // socket.emit('leaveRoom', roomId);
      // console.log('SideBar 전체 채팅룸 퇴장');
    };
  }, [roomId]);

  // 초기 전체 댓글 로드
  useEffect(() => {
    // 전체 댓글 요청
    const fetchTotalComments = async () => {
      try {
        const response = await chatApi.getTotalComments(roomId);
        setMessages(response.data);
      } catch (error) {
        console.error('전체 댓글 로드 실패:', error);
      }
    };
    fetchTotalComments();
  }, [roomId]);

  // 스크롤 자동 이동 함수
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // scrollHeight가 변경될 때 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, messages]);

  // 다른 사용자가 보낸 메시지 받기
  useEffect(() => {
    socket.on('receiveTotalMessage', (data) => {
      // 전체 채팅방 메시지인 경우에만 받기
      if (data.roomId === '1') {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.message_id,
            room_id: data.roomId,
            message: data.message,
            created_at: data.created_at,
            totalLikes: 0,
            linkedByUser: false,
            nickname: data.nickname,
          },
        ]);
      }
    });

    return () => {
      // socket.off('receiveTotalMessage');
    };
  }, [roomId]);

  // 다른 사용자가 보낸 좋아요 받기
  useEffect(() => {
    // 좋아요 변경 이벤트 수신
    socket.on('updateMessageLike', async (data) => {
      const { messageId, totalLikes } = data;

      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, totalLikes } : msg)));
    });

    return () => {
      // socket.off('updateMessageLike');
    };
  }, [setMessages]);

  // 시간 format 수정
  // function formatDate(dateString) {
  //   const now = new Date();
  //   const past = new Date(dateString);
  //   const diff = (now - past) / 1000; // 초 단위 차이

  //   if (diff < 60) {
  //     return `${Math.floor(diff)}초 전`;
  //   } else if (diff < 3600) {
  //     return `${Math.floor(diff / 60)}분 전`;
  //   } else if (diff < 86400) {
  //     return `${Math.floor(diff / 3600)}시간 전`;
  //   } else {
  //     const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  //     return past.toLocaleDateString('ko-KR', options);
  //   }
  // }

  // 시간 변환
  function formatDate(dateString) {
    const past = new Date(dateString);
    const now = new Date();

    // 당일인지 확인
    const isSameDay =
      past.getFullYear() === now.getFullYear() &&
      past.getMonth() === now.getMonth() &&
      past.getDate() === now.getDate();

    if (isSameDay) {
      // 당일이면 시:분 형식으로 반환
      const options = { hour: '2-digit', minute: '2-digit' };
      return past.toLocaleTimeString('ko-KR', options);
    } else {
      // 당일이 아니면 년-월-일 형식으로 반환
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
    <div
      ref={messageContainerRef}
      className="overflow-y-auto py-0 h-auto max-h-[calc(100vh-35rem)] md:max-h-[calc(100vh-35rem)] scrollbar-hide bg-white rounded-md" // 최대 높이 설정
    >
      {messages.map((comment, index) => (
        <div key={index} className="p-3">
          <div key={comment.id} className="flex gap-2 border-b border-black-500 pb-3">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {/* 원 아이콘 */}
                <div className="flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: stringToPastelColor(comment.nickname),
                    }}
                  >
                    {/* {comment.nickname} */}
                  </div>
                </div>

                {/* 닉네임 */}
                <span className="font-sans font-medium text-xs">{comment.nickname}</span>

                {/* 메시지 시간 */}
                <span className="text-xs text-gray-500 font-medium pl-3">{formatDate(comment.created_at)}</span>

                {/* 좋아요 하트 및 개수 */}
                <div className="flex items-center gap-1">
                  <div>
                    {comment.likedByUser ? (
                      <Heart className="w-2 h-2 text-red-500 fill-red-500 hover:scale-110 transition-transform" />
                    ) : (
                      <Heart className="w-2 h-2 text-gray-500 hover:text-red-500 hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{comment.totalLikes}</span>
                </div>
              </div>
              {/* 메시지 내용 */}
              <p className="text-gray-500 font-medium mt-2">{comment.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
