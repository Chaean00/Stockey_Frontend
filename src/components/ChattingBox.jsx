import React, { useRef } from 'react';
import MessageInput from './ChattingInput';

import { socket } from '../pages/ChattingPage/ChattingPage';
import chatApi from '../services/chatApi';


export default function ChattingBox({ messages, username, roomId }) {
  const messageContainerRef = useRef(null);

  const handleLike = async (e, comment) => {
    e.preventDefault();
  
    try {
      if (comment.likedByUser) {
        // 좋아요 취소 API 호출
        await chatApi.unlikeMessage(comment.id);
  
        // 좋아요 취소 소켓 이벤트 전송
        socket.emit('unlikeMessage', {
          messageId: comment.id,
          roomId: roomId,
        });
      } else {
        // 좋아요 추가 API 호출
        await chatApi.likeMessage(comment.id);
  
        // 좋아요 추가 소켓 이벤트 전송
        socket.emit('likeMessage', {
          messageId: comment.id,
          roomId: roomId,
        });
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };
  

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 메시지 목록 */}
      <div
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-3 space-y-4 md:h-96 h-40 scrollbar-hide"
      >
        {messages.map((comment, index) => (
          <div
            key={index}
            className={`flex ${comment.username === username ? 'justify-end' : ''}`}
          >
            {/* <p>{comment.username}</p> */}
            <p>{comment.created_at}</p>
            <p>{comment.message}</p>

            {/* 좋아요 버튼 */}
            {/* <button onClick={() => handleLike(comment.id, comment.likedByUser)}> */}
            <button onClick={(e) => {
              handleLike(e, comment);
            }}>
              {comment.likedByUser ? '❤️' : '♡'}
            </button>

            {/* 좋아요 개수 */}
            <p>{comment.totalLikes}</p>
          </div>
        ))}
      </div>
      {/* 사용자 입력받는 컴포넌트 */}
      <MessageInput roomId={roomId} />
    </div>
  );
}