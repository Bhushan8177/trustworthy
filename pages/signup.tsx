import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';

const { Title } = Typography;
const { Option } = Select;

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('/api/signup', values);
      message.success('Signup successful. Please login.');
      router.push('/login');
    } catch (error) {
      message.error('Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <Title level={2} className="text-center mb-6">Sign Up</Title>
        <Form name="signup" onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
            <Select placeholder="Select a role">
              <Option value="user">User</Option>
              <Option value="driver">Driver</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;