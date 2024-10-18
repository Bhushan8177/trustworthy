import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card, Typography } from 'antd';
import axios from 'axios';
import withAuth from '../components/withAuth';

const { Title } = Typography;
const { Option } = Select;

interface Destination {
  id: string;
  name: string;
}

interface Cab {
  id: string;
  name: string;
  pricePerMinute: number;
}

const BookCab: React.FC = () => {
  const [form] = Form.useForm();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDestinations();
    fetchCabs();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/api/destinations');
      setDestinations(response.data);
    } catch (error) {
      message.error('Failed to fetch destinations');
    }
  };

  const fetchCabs = async () => {
    try {
      const response = await axios.get('/api/cabs');
      setCabs(response.data);
    } catch (error) {
      message.error('Failed to fetch cabs');
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/book-cab', values);
      message.success('Cab booked successfully!');
      form.resetFields();
      // You can add additional logic here, such as showing booking details
    } catch (error) {
      message.error('Failed to book cab');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Title level={2} className="text-center mb-6">Book a Cab</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
            <Select placeholder="Select source">
              {destinations.map((dest) => (
                <Option key={dest.id} value={dest.id}>{dest.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
            <Select placeholder="Select destination">
              {destinations.map((dest) => (
                <Option key={dest.id} value={dest.id}>{dest.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="cabId" label="Select Cab" rules={[{ required: true }]}>
            <Select placeholder="Select cab">
              {cabs.map((cab) => (
                <Option key={cab.id} value={cab.id}>{cab.name} - ${cab.pricePerMinute}/min</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Book Cab
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default withAuth(BookCab, ['user', 'admin']);