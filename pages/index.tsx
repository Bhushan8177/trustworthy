import React from 'react';
import { Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { CarOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';

import Link from 'next/link';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <Title level={1} className="text-4xl font-bold mb-4">Welcome to Swift Ride</Title>
        <Paragraph className="text-xl mb-8">
          Your reliable partner for quick, safe, and affordable cab rides.
        </Paragraph>
        <div className="space-x-4">
          <Link href="/book-cab">
            <a>
              <Button type="primary" size="large" icon={<CarOutlined />}>
                Book a Cab Now
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-12">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Available Cabs" 
              value={5} 
              prefix={<CarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Starting Price" 
              value={10} 
              prefix={<DollarOutlined />} 
              suffix="/ ride" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Average Wait Time" 
              value={5} 
              prefix={<ClockCircleOutlined />} 
              suffix="min" 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Book a Cab"
            extra={<Link href="/book-cab"><a>Book Now</a></Link>}
            className="h-full"
          >
            <p>Find the fastest route and best price for your journey. Our advanced system calculates the shortest path and matches you with the most suitable cab.</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Manage Cabs"
            extra={<Link href="/manage-cabs"><a>Manage</a></Link>}
            className="h-full"
          >
            <p>For administrators: View and edit cab information, update pricing, and monitor bookings. Keep your fleet running smoothly and efficiently.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;