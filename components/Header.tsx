// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <Menu mode="horizontal" theme="dark" className="bg-transparent border-b-0">
          <Menu.Item key="home">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="bookCab">
            <Link href="/book-cab">
              <a>Book a Cab</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="manageCabs">
            <Link href="/manage-cabs">
              <a>Manage Cabs</a>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </header>
  );
};

export default Header;