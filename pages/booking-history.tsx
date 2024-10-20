import React, { useEffect, useState } from 'react';
import { Table, Typography, message } from 'antd';
import axios from 'axios';
import withAuth from '@/components/withAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Booking } from '@/types';

const { Title } = Typography;

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get('/api/bookings', {
          params: { userEmail: user.email }
        });
        setBookings(response.data);
        console.log('Booking history:', response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        message.error('Failed to fetch booking history');
      } finally {
        setLoading(false);
      }
    };

    if (user.email) {
      fetchBookingHistory();
    }
  }, [user.email]);

  const columns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Estimated Time',
      dataIndex: 'estimatedTime',
      key: 'estimatedTime',
      render: (time: number) => `${time} minutes`,
    },
    {
      title: 'Estimated Price',
      dataIndex: 'estimatedPrice',
      key: 'estimatedPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Cab Name',
      dataIndex: 'cabName',
      key: 'cabName',
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="mb-6">Booking History</Title>
      <Table 
        columns={columns} 
        dataSource={bookings} 
        rowKey="_id" 
        loading={loading}
      />
    </div>
  );
};

export default withAuth(BookingHistory);