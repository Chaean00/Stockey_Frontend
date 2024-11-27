import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ChattingRoom = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'User 1',
      content: '최근 금리 인상 발표로 인해 금융 시장이 크게 움직이고 있네요. 은행주는 대출 이자 수익 증가로 긍정적인 영향을 받는 반면, 부채 비율이 높은 기업들은 이자 비용 부담이 커질 수 있어서 주가에 부정적으로 작용할 가능성이 있습니다. 금리가 계속 오를 경우, 소비자들의 지출도 위축될 수 있지 않을까요? 이런 상황에서는 어떤 투자 전략이 좋을지 고민입니다.',
      timestamp: '0분 전',
      liked: true,
    },
    {
      id: 2,
      user: 'User 2',
      content: '맞아요, 금리가 오르면 예금 금리도 함께 올라서 현금을 예금으로 이동시키는 경우가 늘 수 있죠. 개인적으로는 금융주를 추가 매수했습니다. 고민 중이신 과도한 금리 인상이 경기 침체로 이어질 가능성도 있어서 조심스럽습니다. 최근의 금리 인상 흐름이 얼마나 지속될지 예측하기가 어렵네요.',
      timestamp: '0분 전',
      liked: false,
    },
    {
      id: 3,
      user: 'User 3',
      content: '금리 인상이 계속 이어진다면, 결국 개인 소비가 위축되면서 기업들의 매출도 감소할 가능성이 높아질 것 같아요. 이로 인해 소비재 기업들이 타격을 받을 수 있는데, 반대로 저축 성향이 강해지면서 금융권의 수익성이 올라갈 수도 있겠죠. 다들 이런 시기에 어떤 업종에 주목하고 계신가요?',
      timestamp: '0분 전',
      liked: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const likeRatio = 76;

  const handleLike = (messageId) => {
    setMessages(messages.map(message => 
      message.id === messageId 
        ? { ...message, liked: !message.liked }
        : message
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      user: `User ${messages.length + 1}`,
      content: newMessage,
      timestamp: '0분 전',
      liked: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">채팅방 이름</h2>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span className="text-black">좋아요</span>
          <div className="w-40 bg-gray-200 rounded-full h-2.5 mx-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${likeRatio}%`}}></div>
          </div>
          <span>싫어요</span>
        </div>
      </div>
      <div className="p-4 h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex mb-4">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${
              message.id === 1 ? 'bg-blue-200' : 
              message.id === 2 ? 'bg-red-200' : 
              'bg-yellow-200'
            }`}></div>
            <div className="ml-3 flex-grow">
              <div className="flex items-center">
                <span className="font-semibold mr-2">{message.user}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
                <button 
                  onClick={() => handleLike(message.id)}
                  className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label={message.liked ? "Unlike" : "Like"}
                >
                  <Heart className={`h-4 w-4 ${message.liked ? 'fill-current text-red-500' : ''}`} />
                </button>
              </div>
              <p className="text-sm mt-1">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="의견을 자유롭게 남겨주세요"
            className="flex-grow mr-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            보내기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChattingRoom;