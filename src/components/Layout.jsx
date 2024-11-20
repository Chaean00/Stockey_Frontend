import React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header/Navbar */}
      <Header className="fixed top-0 left-0 right-0 z-10 " />
      {/* Main Content */}
      <main className="flex-grow bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
}
