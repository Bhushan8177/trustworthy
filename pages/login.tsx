import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      message.success('Login successful');
      router.push('/');
    } catch (error) {
      message.error('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <Title level={2} className="text-center mb-6">Login</Title>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;