import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  console.log(currentPath, location.pathname);
  return (
    <div className="font-sans flex text-black_default overflow-x-hidden min-h-screen">
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
      <div className={`flex flex-col flex-grow ${['/', '/login', '/signUp'].includes(currentPath) ? '' : 'w-3/4'}`}>
        {/* Header */}
        <Header className="fixed top-0 left-0 right-20 z-10" />

        {/* Page Content */}
        <main className="flex-grow flex lg:p-16 lg:py-20 p-12 pb-16 items-center justify-center relative min-h-screen animate-fadeIn">
          <Outlet context={{ isSidebarOpen }} />
        </main>

        {/* Footer */}
        <Footer className="bg-gray-200" />
      </div>

      {/* Sidebar */}
      <div className={` ${['/', '/login', '/signUp'].includes(currentPath) ? '' : 'w-1/4'}`}>
        <Sidebar />
      </div>
    </div>
  );
}
