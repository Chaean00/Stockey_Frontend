import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import MessageInput from './ChattingInput';

export default function ChattingBox({ messages, username, roomId }) {
  const messageContainerRef = useRef(null);

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 메시지 목록 */}
      <div
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-3 space-y-4 md:h-96 h-40 scrollbar-hide"
      >
        {messages.map((comment, index) => (
          <div
            key={index}
            className={`flex ${comment.username === username ? 'justify-end' : ''}`}
          >
            {/* <p>{comment.username}</p> */}
            <p>{comment.created_at}</p>
            <p>{comment.message}</p>
          </div>
        ))}
      </div>
      {/* 사용자 입력받는 컴포넌트 */}
      <MessageInput roomId={roomId} />
    </div>
  );
}

// ChatBox.propTypes = {
//   messages: PropTypes.arrayOf(
//     PropTypes.shape({
//       username: PropTypes.string,
//       room_id: PropTypes.number,
//       message: PropTypes.string,
//       created_at: PropTypes.string,
//     })
//   ).isRequired,
//   username: PropTypes.string.isRequired,
//   roomId: PropTypes.number.isRequired,
// };