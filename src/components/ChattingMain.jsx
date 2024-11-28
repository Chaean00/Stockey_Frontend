import React from 'react';

import MessageInput from './ChattingInput';

export default function ChattingMain() {
  const chats = [
    {
      user: 'User 2',
      message: '맞아요, 금리가 오르면 예금 금리도 함께 올라서 현금으로 이동시키는 경우가 늘 수 있죠...',
    },
    {
      user: 'User 3',
      message: '금리 인상이 계속 이어진다면 소비가 줄어들 가능성이 높아질 것 같아요...',
    },
  ];

  return (
    <div className="space-y-3">
      {chats.map((chat, index) => (
        <div key={index} className="p-3 bg-gray-100 border border-gray-300 rounded-md">
          <p className="text-sm font-bold text-gray-800">{chat.user}</p>
          <p className="text-sm text-gray-700 mt-1">{chat.message}</p>
        </div>
      ))}
    </div>
  );
}
