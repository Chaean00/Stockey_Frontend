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
  const [username] = useState(localStorage.getItem('username'));

  // chatContext로 관리하는 방법으로 수정
  // const [chatRoomList, setChatRoomList] = useState([]);
  // const [roomId, setRoomId] = useState(1);

  const { chatRoomList, setChatRoomList, roomId, setRoomId, messages, setMessages } = useChatContext();

  // 방 입장
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    return () => {
      if (roomId !== 1) {
        // 전체 채팅방인 경우 소켓 끊지 않고 Layout 단에서 현재 사이드바가 메인이 아니고, 채팅 페이지에 있지만 채팅 페이지면 룸 아이디가 1이 아닐 때 연결 끊기
        socket.emit('leaveRoom', roomId);
      }
    };
  }, [roomId]);

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
      if (roomId !== 1) {
        // 전체 채팅방인 경우 소켓 끊지 않고 Layout 단에서 현재 사이드바가 메인이 아니고, 채팅 페이지에 있지만 채팅 페이지면 룸 아이디가 1이 아닐 때 연결 끊기
        socket.off('receiveTotalMessage');
      }
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
      if (roomId !== 1) {
        // 전체 채팅방인 경우 소켓 끊지 않고 Layout 단에서 현재 사이드바가 메인이 아니고, 채팅 페이지에 있지만 채팅 페이지면 룸 아이디가 1이 아닐 때 연결 끊기
        socket.off('updateMessageLike');
      }
    };
  }, [setMessages]);
  const roomName = chatRoomList.find((chatRoom) => chatRoom.id === roomId)?.name;

  return (
    // <div className="flex flex-col h-screen">
    // <div className='min-w-full'>
    //     <p className="mb-[26px] font-sans font-bold text-[28px]">{chatRoomList.find(chatRoom => chatRoom.id === roomId)?.name}</p>
    //     <ChattingBox messages={messages} setMessages={setMessages} username={username} roomId={roomId} />
    // </div>
    <div className="flex flex-col items-start  w-full min-h-screen px-4">
      <p className="mb-3 font-sans font-bold text-4xl">
        {roomName === '전체' ? (
          <div>전체 커뮤니티</div>
        ) : (
          <div>
            {' '}
            <span className="text-blue-200 text-5xl">[ </span>
            {roomName}
            <span className="text-blue-200 text-5xl"> ] </span> 커뮤니티
          </div>
        )}
      </p>
      {roomName === '전체' ? (
        <p className="mb-3 font-sans font-bold text-xl">
          전체 커뮤니티에서 각종 주식 정보에 대해 활발히 이야기하고, 최신 정보를 공유하는 커뮤니티에 참여하세요
        </p>
      ) : (
        <p className="mb-3 font-sans font-bold text-xl">
          키워드 [{chatRoomList.find((chatRoom) => chatRoom.id === roomId)?.name}]에 대해 활발히 이야기하고, 최신 정보를
          공유하는 커뮤니티에 참여하세요
        </p>
      )}

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
