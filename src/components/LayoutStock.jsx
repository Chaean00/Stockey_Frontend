import React from 'react';
import Footer from './Footer';
import Header from './Header';
import SidebarStock from './SidebarStock';
import { Outlet } from 'react-router-dom';

export default function LayoutStock() {
  return (
    <div>
      {/* Header/Navbar */}
      <Header />
      <SidebarStock />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
