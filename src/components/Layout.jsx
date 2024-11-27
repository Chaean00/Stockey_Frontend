import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarStock from './SidebarStock';
import SidebarKeyword from './SidebarKeyword';
import SidebarChat from './SidebarChat';
import { RiKey2Fill } from 'react-icons/ri';
import { GoHomeFill } from 'react-icons/go';
import { FaChartLine } from 'react-icons/fa6';
import { IoChatbubblesSharp } from 'react-icons/io5';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSidebar, setSelectedSidebar] = useState('main');
  const location = useLocation();
  const { stock_id } = useParams();
  const { keyword_id } = useParams();

  const renderSidebar = () => {
    if (selectedSidebar == 'stock') {
      return <SidebarStock stock_id={stock_id} />;
    } else if (selectedSidebar == 'keyword') {
      return <SidebarKeyword keyword_id={keyword_id} />;
    } else if (selectedSidebar == 'chat') {
      return <SidebarChat />;
    } else return <Sidebar />;
  };

  // 경로에 따른 사이드바 선택
  useState(() => {
    if (location.pathname.startsWith('/stock')) {
      setSelectedSidebar('stock');
    } else if (location.pathname.startsWith('/keyword')) {
      setSelectedSidebar('keyword');
    } else if (location.pathname.startsWith('/chat')) {
      setSelectedSidebar('chat');
    } else setSelectedSidebar('main');
  }, []);

  useState(() => {
    renderSidebar();
  }, [selectedSidebar]);

  return (
    <div className="flex font-black overflow-x-hidden min-h-screen items-stretch h-auto">
      {/* Main Content */}
      <div className="flex flex-col flex-grow w-3/4">
        {/* Header/Navbar */}
        <Header className="fixed top-0 left-0 right-0 z-10" />

        {/* Page Content */}
        {/* 채팅 페이지 패딩값 조정 */}
        <main className={`flex min-w-4xl bg-white items-center justify-center ${ location.pathname.startsWith('/chat') ? 'p-[33px]' : 'flex p-12 pb-16' }`}>
          <Outlet className="mb-10" />
        {/* <main className="flex-grow flex bg-white p-12 pb-16 items-center justify-center">
          <Outlet className="mb-10" /> */}
        </main>
        {/* Footer */}
        <Footer className="bg-gray-200" />
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-1/4' : 'w-20'
        } transition-all duration-300 bg-gray-100 shadow-md flex justify-center`}
      >
        {isSidebarOpen ? <div className="flex-grow  scrollbar-hide overflow-y-auto">{renderSidebar()}</div> : null}
        <div className="min-w-20">
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('main');
            }}
            className="flex flex-col items-center hover:bg-blue-gray-100 m-1 p-1 rounded-md mb-3"
          >
            <GoHomeFill className="text-3xl text-gray-400" />
            <p className="font-semibold text-sm">메인</p>
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('stock');
            }}
            className={`
              ${location.pathname.startsWith('/keyword') ? 'hidden' : 'flex flex-col items-center'}
              hover:bg-blue-gray-100 m-1 p-1 rounded-md mb-3
            `}
          >
            <RiKey2Fill className="text-4xl text-gray-400" />
            <p className="font-semibold text-sm">키워드</p>
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('keyword');
            }}
            className={`
              ${location.pathname.startsWith('/stock') ? 'hidden' : 'flex flex-col items-center'}
              hover:bg-blue-gray-100 m-1 p-1 rounded-md mb-3
            `}
          >
            <FaChartLine className="text-4xl text-gray-400" />
            <p className="font-semibold text-sm">종목</p>
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('chat');
            }}
            className="flex flex-col items-center hover:bg-blue-gray-100 m-1 p-1 rounded-md"
          >
            <IoChatbubblesSharp className="text-4xl text-gray-400" />
            <p className="font-semibold text-sm">채팅</p>
          </div>
        </div>
      </div>
    </div>
  );
}
