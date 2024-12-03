import React, { useState, useEffect, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { socket } from '../pages/ChattingPage/ChattingPage';
import { RiKey2Fill } from 'react-icons/ri';
import { GoHomeFill } from 'react-icons/go';
import { FaChartLine } from 'react-icons/fa6';
import { IoChatbubblesSharp } from 'react-icons/io5';
import SidebarMain from './SidebarMain';
import SidebarStock from './SidebarStock';
import SidebarKeyword from './SidebarKeyword';
import SidebarChat from './SidebarChat';

const SidebarStockMemo = memo(SidebarStock);
const SidebarKeywordMemo = memo(SidebarKeyword);
const SidebarChatMemo = memo(SidebarChat);

export default function Sidebar({ isSidebarOpen }) {
  const [selectedSidebar, setSelectedSidebar] = useState('');
  const location = useLocation();
  const { stock_id, keyword_id } = useParams();

  const renderSidebar = () => {
    switch (selectedSidebar) {
      case 'stock':
        return <SidebarStockMemo stock_id={stock_id} />;
      case 'keyword':
        return <SidebarKeywordMemo keyword_id={keyword_id} />;
      case 'chat':
        return <SidebarChatMemo />;
      case 'main':
        return <SidebarMain />;
    }
  };

  useEffect(() => {
    const newSidebar = location.pathname.startsWith('/stock')
      ? 'stock'
      : location.pathname.startsWith('/keyword')
        ? 'keyword'
        : location.pathname.startsWith('/chat')
          ? 'chat'
          : 'main';

    if (newSidebar !== selectedSidebar) {
      setSelectedSidebar(newSidebar);
    }

    if (!location.pathname.startsWith('/chat')) {
      socket.emit('leaveRoom', 1);
      socket.off('receiveTotalMessage');
      socket.off('updateMessageLike');
    }
  }, [location.pathname]);

  const sidebarHandler = (clicked) => {
    setSelectedSidebar(clicked);
  };
  const currentPath = window.location.pathname;

  return (
    <>
      {!['/', '/login', '/signUp'].includes(currentPath) && (
        <div
          className={`fixed top-0 right-0 h-full bg-gray-100 shadow-md flex justify-center text-gray-400 transition-all duration-400 z-50 w-1/4`}
        >
          <div className="flex-grow scrollbar-hide overflow-y-auto text-black_default">{renderSidebar()}</div>
          <div className="min-w-20">
            <SidebarButton
              icon={<GoHomeFill className="text-2xl" />}
              label="메인"
              isSelected={selectedSidebar === 'main'}
              onClick={() => sidebarHandler('main')}
            />
            {!location.pathname.startsWith('/keyword') && (
              <SidebarButton
                icon={<RiKey2Fill className="text-2xl" />}
                label="키워드"
                isSelected={selectedSidebar === 'stock'}
                onClick={() => sidebarHandler('stock')}
              />
            )}
            {!location.pathname.startsWith('/stock') && (
              <SidebarButton
                icon={<FaChartLine className="text-2xl" />}
                label="종목"
                isSelected={selectedSidebar === 'keyword'}
                onClick={() => sidebarHandler('keyword')}
              />
            )}
            <SidebarButton
              icon={<IoChatbubblesSharp className="text-2xl" />}
              label="채팅"
              isSelected={selectedSidebar === 'chat'}
              onClick={() => sidebarHandler('chat')}
            />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarButton({ icon, label, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center hover:bg-gray-300 m-3 p-1 rounded-md mb-3 ${isSelected ? 'bg-gray-300 text-gray-500' : 'text-gray-400'}`}
    >
      {icon}
      <p className="font-semibold text-sm">{label}</p>
    </div>
  );
}
