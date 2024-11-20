// import React from 'react';
// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// import MessageInput from '../../components/ChattingInput';

// // socket
// import { io } from 'socket.io-client';

// // 소켓 백엔드와 연결
// // const socket = io(import.meta.env.VITE_BACK_URL || 'http://localhost:3000/', {
// export const socket = io('http://localhost:3000/', {
//   transports: ['websocket'],
// });


// export default function ChattingPage() {
//   const [messages, setMessages] = useState([]);
//   const messageContainerRef = useRef(null);
//   const [username] = useState(localStorage.getItem('username'));
//   const [animatedCommentId, setAnimatedCommentId] = useState(null);

//   // 임시 방 번호
//   const roomId = 1;

//   // 방 입장
//   useEffect(() => {
//     socket.emit('joinRoom', roomId);

//     // socket.on('roomUserCount', (msg) => {
//     //   setRoomUserCount(msg);
//     //   // console.log('접속자수:', msg);
//     // });

//     return () => {
//       socket.emit('leaveRoom', roomId);
//       // socket.off('receiveMessage');
//     };
//   }, [roomId]);

//   //초기 전체 댓글 로드
//   useEffect(() => {
//     // 나중에 lib/api에 넣기
//     const fetchTotalComments = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/chat/chat-rooms/${roomId}/messages`);
//         console.log(response.data);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('전체 댓글 로드 실패:', error);
//       }
//     };
//     fetchTotalComments();
//   }, [roomId]);


//   //다른 사용자가 보낸 메시지 받기
//   useEffect(() => {
//     socket.on('receiveTotalMessage', (data) => {
//       console.log('user received total message');
//       setMessages((prevMessages) => {
//         return [
//           ...prevMessages,
//           {
//             username: data.username,
//             room_id: data.roomId,
//             message: data.message,
//             created_at: data.created_at,
//             // likes: data.likes,
//           },
//         ];
//       });
//     });

//     return () => {
//       // socket.emit('leaveTimeLineRoom', currentRoomId);
//       socket.off('receiveTotalMessage');
//     };
//   }, [roomId]);

//   return (
//     <div className="flex flex-col h-screen text-white">
//     {/* 채팅 메시지 목록 (내부 스크롤 적용) */}
//     <div ref={messageContainerRef} className="flex-grow overflow-y-auto p-3 space-y-4 md:h-96 h-40 scrollbar-hide">
//       {messages.map((comment, index) => (
//         <div key={index} className={`flex ${comment.username === username ? 'justify-end' : ''}`}>
//           <p>{comment.user_id}</p>
//           <p>{comment.created_at}</p>
//           <p>{comment.message}</p>
//         </div>
//       ))}
//     </div>
//     {/* 사용자 입력받는 컴포넌트 */}
//     <MessageInput roomId={roomId} />
//   </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChattingBox from '../../components/ChattingBox';
import { BASE_URL } from '../../../lib/api/api';

// 소켓 백엔드와 연결
export const socket = io('http://localhost:3000/', {
  transports: ['websocket'],
});

export default function ChattingPage() {
  const [messages, setMessages] = useState([]);
  const [username] = useState(localStorage.getItem('username'));
  const [chatRoomList, setChatRoomList] = useState([]);
  const [roomId, setRoomId] = useState(1);

  // 방 입장
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    return () => {
      socket.emit('leaveRoom', roomId);
    };
  }, [roomId]);

  // 초기 전체 댓글 로드
  useEffect(() => {
    // 전체 댓글 요청
    const fetchTotalComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chat/chat-rooms/${roomId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('전체 댓글 로드 실패:', error);
      }
    };
    fetchTotalComments();
  }, [roomId]);

  // 채팅방 목록 로드
  useEffect(() => {
    // 전체 채팅방 목록 요청
    const fetchChatList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/chat/chat-rooms`);
        setChatRoomList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('채팅방 목록 로드 실패:', error);
      }
    }
    fetchChatList();
  }, []);


  // 다른 사용자가 보낸 메시지 받기
  useEffect(() => {
    socket.on('receiveTotalMessage', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: data.username,
          room_id: data.roomId,
          message: data.message,
          created_at: data.created_at,
        },
      ]);
    });

    return () => {
      socket.off('receiveTotalMessage');
    };
  }, [roomId]);

  return (
    <div className="flex flex-col h-screen text-white">
      <div>
        {/* 사이드 바로 변경될 부분 */}
        {chatRoomList.map((item, index) => {
          return (
            <button key={index} onClick={() => setRoomId(item.id)}>
              {item.id}
            </button>
          );
        })}
      </div>
      <ChattingBox messages={messages} username={username} roomId={roomId} />
    </div>
  );
}