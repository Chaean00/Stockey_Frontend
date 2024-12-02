import React, { createContext, useContext, useState, useEffect } from 'react';
import chatApi from '../services/chatApi';

const ChatContext = createContext();

// Context Provider
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);
  const [roomId, setRoomId] = useState(1);

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
    };
    fetchChatList();
  }, []);

  // 초기 전체 댓글 로드
  useEffect(() => {
    // 전체 댓글 요청
    const fetchTotalComments = async () => {
      try {
        const response = await chatApi.getTotalComments(roomId);
        setMessages(response.data);
        console.log('전체 댓글:', response.data);
      } catch (error) {
        console.error('전체 댓글 로드 실패:', error);
      }
    };
    fetchTotalComments();
  }, [roomId]);

  return (
    <ChatContext.Provider value={{ chatRoomList, setChatRoomList, roomId, setRoomId, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// Context를 사용하는 커스텀 Hook
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
