// userApi.jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // 필요 시 인증 정보를 포함
});

const chatApi = {
    // 전체 댓글 가져오기
    getTotalComments: (roomId) => axiosInstance.get(`/chat/chat-rooms/${roomId}/messages`),

    // 전체 채팅방 목록 가져오기
    getChatList: () => axiosInstance.get('/chat/chat-rooms'),

    // 채팅 메시지 저장
    postMessage: (roomId, newComment) => axiosInstance.post(`/chat/chat-rooms/${roomId}/messages`, newComment),

    // 메시지 좋아요
    likeMessage: (messageId) => axiosInstance.post(`/chat/messages/${messageId}/like`),

    // 메시지 좋아요 취소
    unlikeMessage: (messageId) => axiosInstance.delete(`/chat/messages/${messageId}/unlike`),

    // 로그인한 유저에 대한 메시지 상태 가져오기
    messageStatus: (messageId) => axiosInstance.get(`/chat/messages/${messageId}/like-status`),

    // 가중치 순위 채팅방 목록 가져오기
    getWeightRankings: () => axiosInstance.get('/chat/weight/rankings'),

    // 즐겨찾기 순위 채팅방 목록 가져오기
    getBookmarkRankings: () => axiosInstance.get('/chat/bookmark/rankings'),
    
};

export default chatApi;
