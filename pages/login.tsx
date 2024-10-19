import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', values);
      Cookies.set('token', response.data.token, { expires: 1 }); // Set token to expire in 1 day
      
      // Dispatch user data to Redux store
      dispatch(setUser({
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role
      }));

      message.success('Login successful');
      
      // Check if there's a redirect URL in the query params
      const { redirect } = router.query;
      if (typeof redirect === 'string' && redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Login failed');
      } else {
        message.error('An unexpected error occurred');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Login</Title>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;