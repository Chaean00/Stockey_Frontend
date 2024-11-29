import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChattingBox from '../../components/ChattingBox';
import { BASE_URL } from '../../../lib/api/api';
import chatApi from '../../services/chatApi';
import { TbMapPin2 } from 'react-icons/tb';
import { useChatContext } from '../../utils/chatContext';

// 소켓 백엔드와 연결
export const socket = io(`${import.meta.env.VITE_SERVER_HOST}`, {
  transports: ['websocket'],
});

export default function ChattingPage() {
  const [messages, setMessages] = useState([]);
  const [username] = useState(localStorage.getItem('username'));

  // chatContext로 관리하는 방법으로 수정
  // const [chatRoomList, setChatRoomList] = useState([]);
  // const [roomId, setRoomId] = useState(1);

  const { chatRoomList, setChatRoomList, roomId, setRoomId } = useChatContext();

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
        const response = await chatApi.getTotalComments(roomId);
        setMessages(response.data);
        console.log("전체 댓글:", response.data);
      } catch (error) {
        console.error('전체 댓글 로드 실패:', error);
      }
    };
    fetchTotalComments();
  }, [roomId]);

  // chatContext로 관리하는 방법으로 수정
  // 채팅방 목록 로드
  // useEffect(() => {
  //   // 전체 채팅방 목록 요청
  //   const fetchChatList = async () => {
  //     try {
  //       const response = await chatApi.getChatList();
  //       setChatRoomList(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('채팅방 목록 로드 실패:', error);
  //     }
  //   }
  //   fetchChatList();
  // }, []);


  // 다른 사용자가 보낸 메시지 받기
  useEffect(() => {
    socket.on('receiveTotalMessage', (data) => {
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
    });

    return () => {
      socket.off('receiveTotalMessage');
    };
  }, [roomId]);

  // 다른 사용자가 보낸 좋아요 받기
  useEffect(() => {
    // 좋아요 변경 이벤트 수신
    socket.on('updateMessageLike', async (data) => {
      const { messageId, totalLikes } = data;

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, totalLikes}
            : msg
        )
      );
    });

    return () => {
      socket.off('updateMessageLike');
    };
  }, [setMessages]);

  return (
    // <div className="flex flex-col h-screen">
        // <div className='min-w-full'>
        //     <p className="mb-[26px] font-sans font-bold text-[28px]">{chatRoomList.find(chatRoom => chatRoom.id === roomId)?.name}</p>
        //     <ChattingBox messages={messages} setMessages={setMessages} username={username} roomId={roomId} />
        // </div>
        <div className="flex flex-col items-start  w-full min-h-screen px-4">
    <p className="mb-2 font-sans font-bold text-[28px]">
        {chatRoomList.find(chatRoom => chatRoom.id === roomId)?.name}
    </p>
    <ChattingBox 
        className="w-full"
        messages={messages} 
        setMessages={setMessages} 
        username={username} 
        roomId={roomId} 
    />
</div>
    // </div>
  );
}