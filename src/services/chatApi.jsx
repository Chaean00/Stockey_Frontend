// userApi.jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const chatApi = {
    // 전체 댓글 가져오기
    getTotalComments: (roomId) => axiosInstance.get(`api/chat/chat-rooms/${roomId}/messages`),

    // 전체 채팅방 목록 가져오기
    getChatList: () => axiosInstance.get('/api/chat/chat-rooms'),

    // 채팅 메시지 저장
    postMessage: (roomId, newComment) => axiosInstance.post(`api/chat/chat-rooms/${roomId}/messages`, newComment),

    // 메시지 좋아요
    likeMessage: (messageId) => axiosInstance.post(`api/chat/messages/${messageId}/like`),

    // 메시지 좋아요 취소
    unlikeMessage: (messageId) => axiosInstance.delete(`api/chat/messages/${messageId}/unlike`),
};

export default chatApi;
