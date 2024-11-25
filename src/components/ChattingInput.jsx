import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../lib/api/api';
// import { toast } from 'react-toastify';
// import { socket } from '../ChattingPage';
import { socket } from '../pages/ChattingPage/ChattingPage';
import chatApi from '../services/chatApi';

export default function MessageInput({ roomId }) {
  const [message, setMessage] = useState('');
//   const [username] = useState(localStorage.getItem('username'));

  //메시지 보내기
  const sendMessage = async (e) => {
    const currentDate = new Date();

    e.preventDefault();

    // if (!username) {
    //   toast.error('로그인 후 사용해 주세요.');
    //   return;
    // }
    if (message && roomId) {
      const newComment = {
        message: message,
        created_at: currentDate,
      };

      try {
        // DB에 채팅 메시지 저장
        const response = await chatApi.postMessage(roomId, newComment);
        const message_id = response.data.message_id
        
        // 소켓으로 전송
        socket.emit('sendTotalMessage', {
        //   username: username,
          roomId: roomId,
          message_id: message_id,
          message: newComment.message,
          created_at: newComment.created_at,
          nickname: localStorage.getItem('nickname'),
        });
        setMessage('');
      } catch (error) {
        console.error('댓글 저장 실패:', error);
        // toast.error('댓글을 저장하지 못했습니다. 다시 시도해 주세요.');

        // Optional: Delay navigation or other actions to ensure the toast is displayed
        setTimeout(() => {
          // Perform any actions like navigation or state updates here
        }, 2000); // 3-second delay to ensure toast is shown
      }
    }
  };

  // 엔터 누를 때 바로 채팅이 보내지도록 handler 설정
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    //  메시지 입력란 (화면 하단 고정)
    <div className="flex mx-3 mb-3 px-2 py-2 bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
      <form onSubmit={sendMessage} className="w-full">
        <div className="flex flex-col h-full w-full">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="의견을 자유롭게 남겨주세요."
            className="focus:outline-none w-full bg-gray-100 font-medium resize-none h-8 pt-2 pl-2"
            rows={3}
          />
          <div className="flex justify-end mt-2 p-1">
            <button 
              type="submit" 
              className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
            >
              보내기
            </button>
          </div>
        </div>
      </form>
    </div>
    
  );
}