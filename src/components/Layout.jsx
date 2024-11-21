import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarStock from './SidebarStock';
import SidebarKeyword from './SidebarKeyword';
import { RiKey2Fill } from 'react-icons/ri';
import { GoHomeFill } from 'react-icons/go';
import { FaChartLine } from 'react-icons/fa6';
import { IoChatbubblesSharp } from 'react-icons/io5';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSidebar, setSelectedSidebar] = useState('main');
  const location = useLocation();
  const { stock_id } = useParams();

  const renderSidebar = () => {
    if (selectedSidebar == 'stock') {
      return <SidebarStock stock_id={stock_id} />;
    } else if (selectedSidebar == 'keyword') {
      return <SidebarKeyword />;
    } else return <Sidebar />;
  };

  // 경로에 따른 사이드바 선택
  useState(() => {
    if (location.pathname.startsWith('/stock')) {
      setSelectedSidebar('stock');
    } else if (location.pathname.startsWith('/keyword')) {
      setSelectedSidebar('keyword');
    } else setSelectedSidebar('main');
  }, []);

  useState(() => {
    renderSidebar();
  }, [selectedSidebar]);

  return (
    <div className="flex h-screen font-black">
      {/* Main Content */}
      <div className="flex flex-col flex-grow w-3/">
        {/* Header/Navbar */}
        <Header className="fixed top-0 left-0 right-0 z-10" />

        {/* Page Content */}
        <main className="flex-grow bg-white p-20 ">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer className="mt-auto" />
      </div>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-1/4' : 'w-20'
        } transition-all duration-300 bg-gray-100 shadow-md h-full flex justify-center`}
      >
        {isSidebarOpen ? <div className="flex-grow overflow-y-auto">{renderSidebar()}</div> : null}
        <div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('main');
            }}
            className="flex flex-col items-center hover:bg-blue-gray-100 m-1 p-1 rounded-md"
          >
            <GoHomeFill className="text-4xl text-gray-400" />
            <p className="font-semibold text-sm">메인</p>
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('stock');
            }}
            className="flex flex-col items-center hover:bg-blue-gray-100 m-1 p-1 rounded-md"
          >
            <RiKey2Fill className="text-4xl text-gray-400" />
            <p className="font-semibold text-sm">키워드</p>
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setSelectedSidebar('keyword');
            }}
            className="flex flex-col items-center hover:bg-blue-gray-100 m-1 p-1 rounded-md"
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
