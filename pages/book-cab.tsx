import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Card, Typography, Row, Col, message } from 'antd';
import { Graph, createGraphFromImage } from '../utils/graph';
import GraphVisualization from './GraphVisualization';

const { Title, Text } = Typography;
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

const destinations: Destination[] = [
  { id: 'A', name: 'Location A' },
  { id: 'B', name: 'Location B' },
  { id: 'C', name: 'Location C' },
  { id: 'D', name: 'Location D' },
  { id: 'E', name: 'Location E' },
  { id: 'F', name: 'Location F' },
];

const cabs: Cab[] = [
  { id: '1', name: 'Economy', pricePerMinute: 0.5 },
  { id: '2', name: 'Comfort', pricePerMinute: 0.75 },
  { id: '3', name: 'Business', pricePerMinute: 1 },
  { id: '4', name: 'VIP', pricePerMinute: 1.5 },
  { id: '5', name: 'Luxury', pricePerMinute: 2 },
];

const BookCab: React.FC = () => {
  const [form] = Form.useForm();
  const [graph] = useState<Graph>(createGraphFromImage());
  const [path, setPath] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const calculateRoute = () => {
    const source = form.getFieldValue('source');
    const destination = form.getFieldValue('destination');
    if (source && destination) {
      const { path, time } = graph.shortestPath(source, destination);
      setPath(path);
      setEstimatedTime(time);
    } else {
      setPath([]);
      setEstimatedTime(null);
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [form.getFieldValue('source'), form.getFieldValue('destination')]);

  const onFinish = (values: any) => {
    const { source, destination, cabId } = values;
    const { path, time } = graph.shortestPath(source, destination);
    const selectedCab = cabs.find(cab => cab.id === cabId);
    if (selectedCab) {
      const price = time * selectedCab.pricePerMinute;
      setEstimatedPrice(price);
      message.success(`Cab booked! Estimated time: ${time} minutes. Estimated price: $${price.toFixed(2)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Title level={2} className="text-center mb-6">Book a Cab</Title>
        <Row gutter={24}>
          <Col span={12}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="source" label="Source" rules={[{ required: true }]}>
                <Select placeholder="Select source" onChange={calculateRoute}>
                  {destinations.map((dest) => (
                    <Option key={dest.id} value={dest.id}>{dest.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
                <Select placeholder="Select destination" onChange={calculateRoute}>
                  {destinations.map((dest) => (
                    <Option key={dest.id} value={dest.id}>{dest.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              {estimatedTime !== null && (
                <Form.Item name="cabId" label="Select Cab" rules={[{ required: true }]}>
                  <Select placeholder="Select cab">
                    {cabs.map((cab) => (
                      <Option key={cab.id} value={cab.id}>{cab.name} - ${cab.pricePerMinute}/min</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" block disabled={estimatedTime === null}>
                  Book Cab
                </Button>
              </Form.Item>
            </Form>
            {estimatedTime !== null && (
              <div className="mt-4">
                <Text strong>Estimated Time: {estimatedTime} minutes</Text>
                <br />
                <Text strong>Route: {path.join(' -> ')}</Text>
                {estimatedPrice !== null && (
                  <><br /><Text strong>Estimated Price: ${estimatedPrice.toFixed(2)}</Text></>
                )}
              </div>
            )}
          </Col>
          <Col span={12}>
            <GraphVisualization highlightedPath={path} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BookCab;