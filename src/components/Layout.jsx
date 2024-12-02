import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="font-sans flex text-black_default overflow-x-hidden min-h-screen relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      {/* Main Content */}
      <div className="flex flex-col flex-grow absolute top-0 left-0 right-20">
        {/* Header */}
        <Header className="fixed top-0 left-0 right-20 z-10" />

        {/* Page Content */}
        <main className="flex-grow flex lg:p-32 lg:py-20 p-12 pb-16 items-center justify-center relative min-h-screen animate-fadeIn">
          <Outlet context={{ isSidebarOpen, setIsSidebarOpen }} />
        </main>

        {/* Footer */}
        <Footer className="bg-gray-200" />
      </div>

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 right-20 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}
