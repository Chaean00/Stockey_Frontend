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
        const message_id = response.data.message_id;

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

  return (
    //  메시지 입력란 (화면 하단 고정)
    <div className="flex mx-3 mb-3 px-2 py-2 rounded-full bg-white text-black_default placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <form onSubmit={sendMessage} className="flex justify-between w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="focus:outline-none w-10/12"
        />
        <button type="submit" className="flex items-center justify-center mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6 text-blue-600 hover:text-blue-900"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
          </svg>
        </button>
      </form>
    </div>
  );
}
