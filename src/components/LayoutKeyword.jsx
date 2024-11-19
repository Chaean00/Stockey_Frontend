import React from 'react';
import Footer from './Footer';
import Header from './Header';
import SidebarKeyword from './SidebarKeyword';
import { Outlet } from 'react-router-dom';

export default function LayoutKeyword() {
  return (
    <div>
      {/* Header/Navbar */}
      <Header />
      <SidebarKeyword />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
