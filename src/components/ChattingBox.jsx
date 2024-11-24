// import React, { useRef } from 'react';
// import MessageInput from './ChattingInput';

// import { socket } from '../pages/ChattingPage/ChattingPage';
// import chatApi from '../services/chatApi';


// export default function ChattingBox({ messages, setMessages, username, roomId }) {
//   const messageContainerRef = useRef(null);

//   const handleLike = async (e, comment) => {
//     e.preventDefault();
  
//     try {
//       // 좋아요가 눌린 상태면
//       if (comment.likedByUser) {
//         // 좋아요 취소 API 호출
//         await chatApi.unlikeMessage(comment.id);
  
//         // 좋아요 취소 소켓 이벤트 전송
//         socket.emit('unlikeMessage', {
//           messageId: comment.id,
//           roomId: roomId,
//         });

//         // 좋아요 표시 본인 로컬에만 반영
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.id === comment.id ? { ...msg, likedByUser: false } : msg
//           )
//         );
//       } else { // 좋아요가 눌리지 않은 상태면
//         // 좋아요 추가 API 호출
//         await chatApi.likeMessage(comment.id);
  
//         // 좋아요 추가 소켓 이벤트 전송
//         socket.emit('likeMessage', {
//           messageId: comment.id,
//           roomId: roomId,
//         });

//         // 좋아요 표시 본인 로컬에만 반영
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.id === comment.id ? { ...msg, likedByUser: true } : msg
//           )
//         );
//       }
//     } catch (error) {
//       console.error('좋아요 처리 실패:', error);
//     }
//   };
  

//   return (
//     <div className="flex flex-col h-full">
//       {/* 채팅 메시지 목록 */}
//       <div
//         ref={messageContainerRef}
//         className="flex-grow overflow-y-auto p-3 space-y-4 md:h-96 h-40 scrollbar-hide"
//       >
//         {messages.map((comment, index) => (
//           <div
//             key={index}
//             className={`flex ${comment.username === username ? 'justify-end' : ''}`}
//           >
//             {/* <p>{comment.username}</p> */}
//             <p>{comment.created_at}</p>
//             <p>{comment.message}</p>

//             {/* 좋아요 버튼 */}
//             {/* <button onClick={() => handleLike(comment.id, comment.likedByUser)}> */}
//             <button onClick={(e) => {
//               handleLike(e, comment);
//             }}>
//               {comment.likedByUser ? '❤️' : '♡'}
//             </button>

//             {/* 좋아요 개수 */}
//             <p>{comment.totalLikes}</p>
//           </div>
//         ))}
//       </div>
//       {/* 사용자 입력받는 컴포넌트 */}
//       <MessageInput roomId={roomId} />
//     </div>
//   );
// }

import React, { useRef, useEffect } from 'react';
import MessageInput from './ChattingInput';
import { ChevronDown, Heart } from 'lucide-react'

import { socket } from '../pages/ChattingPage/ChattingPage';
import chatApi from '../services/chatApi';


export default function ChattingBox({ messages, setMessages, username, roomId }) {
  const messageContainerRef = useRef(null);

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
          prevMessages.map((msg) =>
            msg.id === comment.id ? { ...msg, likedByUser: false } : msg
          )
        );
      } else { // 좋아요가 눌리지 않은 상태면
        // 좋아요 추가 API 호출
        await chatApi.likeMessage(comment.id);
  
        // 좋아요 추가 소켓 이벤트 전송
        socket.emit('likeMessage', {
          messageId: comment.id,
          roomId: roomId,
        });

        // 좋아요 표시 본인 로컬에만 반영
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === comment.id ? { ...msg, likedByUser: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
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
  }, [messageContainerRef.current?.scrollHeight]);

  //시간 format 수정
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
  

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-black-500">
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              최신순
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={messageContainerRef}
          className="flex-grow overflow-y-auto p-3 space-y-4 md:h-96 h-40 scrollbar-hide"
        >
          {/* 채팅 메시지 목록 */}
          {messages.map((comment) => (
            <div key={comment.id} className="flex gap-4 border-b border-black-500 pb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                  {/* {comment.nickname} */}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.nickname}</span>
                  <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <div className='cursor-pointer hover:text-red-500' onClick={(e) => {
                      handleLike(e, comment);
                    }}>
                    {comment.likedByUser ? (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500 hover:scale-110 transition-transform" />
                    ) : (
                      <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 hover:scale-110 transition-transform" />
                    )}
                    </div>
                    <span className="text-sm text-gray-500">{comment.totalLikes}</span>
                  </div>
                </div>
                <p className="text-gray-700">{comment.message}</p>
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