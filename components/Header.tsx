import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store/userSlice';
import { RootState } from '../store/store';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await axios.get('/api/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        dispatch(clearUser());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(clearUser());
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
          {user.role === 'admin' && (
            <Menu.Item key="/manage-cabs" style={menuItemStyle}>
              <Link href="/manage-cabs">
                <a>Admin Dashboard</a>
              </Link>
            </Menu.Item>
          )}
          {user.role !== 'admin' && (
            <Menu.Item key="/booking-history" style={menuItemStyle}>
              <Link href="/booking-history">
                <a>Booking History</a>
              </Link>
            </Menu.Item>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {user.name ? (
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