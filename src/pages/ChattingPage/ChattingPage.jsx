import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChattingBox from '../../components/ChattingBox';
import { BASE_URL } from '../../../lib/api/api';
import chatApi from '../../services/chatApi';

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
        const response = await chatApi.getTotalComments(roomId);
        setMessages(response.data);
        console.log("전체 댓글:", response.data);
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
        const response = await chatApi.getChatList();
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
          id: data.message_id,
          username: data.username,
          room_id: data.roomId,
          message: data.message,
          created_at: data.created_at,
          totalLikes: 0,
          linkedByUser: false,
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
    <div className="flex flex-col h-screen">
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
      <ChattingBox messages={messages} setMessages={setMessages} username={username} roomId={roomId} />
    </div>
  );
}