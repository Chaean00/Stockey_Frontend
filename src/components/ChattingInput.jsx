import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { socket } from '../pages/ChattingPage/ChattingPage';
import chatApi from '../services/chatApi';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function MessageInput({ roomId }) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('nickname'));

  dayjs.extend(utc);
  dayjs.extend(timezone);

  //메시지 보내기
  const sendMessage = async (e) => {
    // 한국 시간으로 ISO 8601 형식 출력
    const currentDate = dayjs().tz('Asia/Seoul').toISOString();

    e.preventDefault();
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
          nickname: username,
        });
        setMessage('');
      } catch (error) {
        console.error('댓글 저장 실패:', error);
        if (error.response.data.message === 'Authorization Null') {
          toast.error('로그인 후 사용해 주세요.');
        }
      }
    }
  };

  // 엔터 누를 때 바로 채팅이 보내지도록 handler 설정
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter');
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    //  메시지 입력란 (화면 하단 고정)
    // <div className="flex mx-3 mb-3 px-2 py-2 bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
    //   <form onSubmit={sendMessage} className="w-full">
    //     {/* 채팅 입력 부분 긴 버전 */}
    //     {/* <div className="flex flex-col h-full w-full"> */}
    //       {/* <textarea
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         onKeyPress={(e) => {handleKeyPress(e)}}
    //         placeholder="의견을 자유롭게 남겨주세요."
    //         className="focus:outline-none w-full bg-gray-100 font-medium resize-none h-[143px] pt-2 pl-2"
    //         rows={3}
    //       /> */}
    //       {/* 채팅 입력 부분 짧은 버전 */}
    //         <div className='flex flex-row w-full justify-between'>
    //       <input
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         placeholder="의견을 자유롭게 남겨주세요."
    //         className="focus:outline-none bg-gray-100 font-medium"
    //       />
    //       <div className="flex justify-end mt-2 p-1">
    //         <button
    //           type="submit"
    //           className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
    //         >
    //           보내기
    //         </button>
    //       </div>
    //     </div>
    //   </form>
    // </div>

    //   <div className="p-4">
    //   <div className="flex gap-2">
    //   <form onSubmit={sendMessage} className='w-full'>
    //     <input
    //       type="text"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //       placeholder="의견을 자유롭게 남겨주세요"
    //       className="flex-1 px-4 py-2 rounded-lg border bg-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
    //     />
    //     <button
    //       type="submit"
    //       className="px-4 py-2 bg-blue-200 text-white rounded-lg">
    //       보내기
    //     </button>
    //     </form>
    //   </div>
    // </div>

    <div className="p-4">
      <div className="flex">
        <form onSubmit={sendMessage} className="flex gap-x-2 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="의견을 자유롭게 남겨주세요"
            className="flex-1 px-4 py-2 rounded-lg border bg-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button type="submit" className="px-4 py-2 bg-blue-200 text-white rounded-lg flex-shrink-0">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
