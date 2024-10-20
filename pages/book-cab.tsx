import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Card, Typography, Row, Col, message, Radio, Modal } from 'antd';
import { Graph, createGraphFromImage } from '@/utils/graph';
import GraphVisualization from './GraphVisualization';
import { Cab } from '@/types';
import withAuth from '@/components/withAuth';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Destination {
  id: string;
  name: string;
}

const destinations: Destination[] = [
  { id: 'A', name: 'Location A' },
  { id: 'B', name: 'Location B' },
  { id: 'C', name: 'Location C' },
  { id: 'D', name: 'Location D' },
  { id: 'E', name: 'Location E' },
  { id: 'F', name: 'Location F' }
];

const BookCab: React.FC = () => {
  const [form] = Form.useForm();
  const [graph] = useState<Graph>(createGraphFromImage());
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [path, setPath] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [selectedCabId, setSelectedCabId] = useState<ObjectId | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [source, setSource] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const user = useSelector((state: RootState) => state.user);

  const calculateRoute = () => {
    if (source && destination) {
      const { path, time } = graph.shortestPath(source, destination);
      setPath(path);
      setEstimatedTime(time);
    } else {
      setPath([]);
      setEstimatedTime(null);
    }
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
    form.setFieldsValue({ source: value });
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    form.setFieldsValue({ destination: value });
  };


  const fetchCabs = async () => {
    try {
      const response = await axios.get('/api/cabs');
      const transformedCabs = response.data.map((cab: any) => ({
        ...cab,
        id: cab._id.$oid,
        pricePerMinute: parseFloat(cab.pricePerMinute)
      }));
      setCabs(transformedCabs);
    } catch (error) {
      console.error('Error fetching cabs:', error);
      message.error('Failed to fetch cabs. Please try again.');
    }
  };

  useEffect(() => {
    if (source && destination) {
      calculateRoute();
      fetchCabs();
    }
  }, [destination]);

  const handleCabSelection = (cabId: ObjectId) => {
    console.log('Cab selected:', cabId);
    setSelectedCabId(cabId);
    form.setFieldsValue({ cabId: cabId });
  };


  const showModal = (values: any) => {
    const { source, destination, cabId } = values;
    if (!cabId) {
      message.error('Please select a cab');
      return;
    }
    const { path, time } = graph.shortestPath(source, destination);
    const selectedCab = cabs.find(cab => cab._id === cabId);
    if (selectedCab) {
      const price = time * selectedCab.pricePerMinute;
      const arrivalTime = new Date(Date.now() + time * 60000).toLocaleTimeString();
      setBookingDetails({
        userEmail: user.email,
        source: destinations.find(d => d.id === source)?.name,
        destination: destinations.find(d => d.id === destination)?.name,
        estimatedTime: time,
        estimatedPrice: price,
        cabName: selectedCab.name,
        arrivalTime
      });
      setIsModalVisible(true);
    }
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    setLoading(true);
    try {

      // Confirm the booking
      const bookingResponse = await axios.post('/api/bookings', bookingDetails);

      // Mark the cab as unavailable
      const statusUpdateResponse = await axios.put(`/api/cabs/${selectedCabId}`, { status: 'unavailable' });

      if (statusUpdateResponse.status !== 200) {
        throw new Error('Failed to update cab status');
      }
      // Send an email to the user
      try {
        await axios.post('/api/send-mail', {
          email: user.email,
          subject: 'Booking Confirmed',
          text: `Your booking has been confirmed. Cab will arrive at ${bookingDetails.arrivalTime}.`
        });
      } catch (error) {
        console.error('Error sending email:', error);
        message.error('Failed to send booking confirmation email');
      }


      message.success('Booking confirmed successfully!');

      // Refresh the cab list to reflect the updated status
      fetchCabs();

      // Reset the form and selected cab
      form.resetFields();
      setSelectedCabId(null);
      setEstimatedTime(null);

      setPath([]);      
    } catch (error) {
      console.error('Error confirming booking:', error);
      message.error('Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Title level={2} className="text-center mb-6">Book a Cab</Title>
        <Row gutter={24}>
          <Col span={12}>
            <Form form={form} layout="vertical" onFinish={showModal}>
              <Form.Item name="source" label="Source" rules={[{ required: true }]}>
                <Select placeholder="Select source" onChange={handleSourceChange}>
                  {destinations.map((dest) => (
                    <Option key={dest.id} value={dest.id}>{dest.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
                <Select placeholder="Select destination" onChange={handleDestinationChange}>
                  {destinations.filter(dest => dest.id !== source).map((dest) => (
                    <Option key={dest.id} value={dest.id}>{dest.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              {estimatedTime !== null && (
                <Form.Item
                  name="cabId"
                  label={selectedCabId ? null : "Select Cab"} rules={[{ required: true, message: 'Please select a cab' }]}
                >
                  <Radio.Group onChange={(e) => handleCabSelection(e.target.value)}>
                    <Row gutter={[16, 42]}>
                      {cabs.map((cab) => (
                        <Col span={12} key={cab._id.toString()}>
                          <Radio.Button value={cab._id} disabled={cab.status === 'unavailable'}>
                            <Card
                              hoverable
                              className={`w-full ${cab.status === 'unavailable' ? 'opacity-50' : ''} ${selectedCabId === cab._id ? 'shadow-2xl' : ''}`}
                            >
                              <Title level={4}>{cab.name}</Title>
                              <Paragraph>{cab.description}</Paragraph>
                              <Text strong>${cab.pricePerMinute}/min</Text>
                              <br />
                              <Text type={cab.status === 'available' ? 'success' : 'danger'}>
                                {cab.status.charAt(0).toUpperCase() + cab.status.slice(1)}
                              </Text>
                            </Card>
                          </Radio.Button>
                        </Col>
                      ))}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              )}

              <Form.Item className='mt-10'>
                <Button type="primary" htmlType="submit" block loading={loading} disabled={!selectedCabId || estimatedTime === null}>
                  Review Booking
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <GraphVisualization highlightedPath={path} />
          </Col>
        </Row>
      </Card>

      <Modal
        title="Review Your Booking"
        visible={isModalVisible}
        okText="Confirm Booking"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {bookingDetails && (
          <>
            <p><strong>Source:</strong> {bookingDetails.source}</p>
            <p><strong>Destination:</strong> {bookingDetails.destination}</p>
            <p><strong>Estimated Time:</strong> {bookingDetails.estimatedTime} minutes</p>
            <p><strong>Estimated Price:</strong> ${bookingDetails.estimatedPrice.toFixed(2)}</p>
            <p><strong>Selected Cab:</strong> {bookingDetails.cabName}</p>
            <p><strong>Estimated Arrival Time:</strong> {bookingDetails.arrivalTime}</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default withAuth(BookCab, ['user', 'admin']);