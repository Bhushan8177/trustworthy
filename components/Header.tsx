import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import type { MenuProps } from 'antd';
import type { User } from '../types';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get('/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          console.log('User data:', response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
  };

  const menuItemStyle = {
    color: 'white',
  };

  return (
    <header style={{ backgroundColor: '#1890ff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        <Menu mode="horizontal" style={menuStyle} selectedKeys={[router.pathname]}>
          <Menu.Item key="/" style={menuItemStyle}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/book-cab" style={menuItemStyle}>
            <Link href="/book-cab">
              <a>Book a Cab</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/manage-cabs" style={menuItemStyle}>
            <Link href="/manage-cabs">
              <a>Manage Cabs</a>
            </Link>
          </Menu.Item>
          <div style={{ marginLeft: 'auto' }}>
            {user ? (
              <Dropdown menu={{ items: userMenuItems }}>
                <Button type="text" style={{ color: 'white' }}>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                  Welcome, {user.name}
                </Button>
              </Dropdown>
            ) : (
              <>
                <Menu.Item key="/login" style={menuItemStyle}>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/signup" style={menuItemStyle}>
                  <Link href="/signup">
                    <a>Sign Up</a>
                  </Link>
                </Menu.Item>
              </>
            )}
          </div>
        </Menu>
      </div>
    </header>
  );
};

export default Header;