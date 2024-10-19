import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Typography, Select, InputNumber } from 'antd';
import axios from 'axios';
import withAuth from '@/components/withAuth';
import { Cab } from '@/types';
import { render } from 'react-dom';


const { Title } = Typography;


const ManageCabs: React.FC = () => {
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCab, setEditingCab] = useState<Cab | null>(null);

  useEffect(() => {
    fetchCabs();
  }, []);

  const fetchCabs = async () => {
    try {
      const response = await axios.get('/api/cabs');
      setCabs(response.data);
    } catch (error) {
      message.error('Failed to fetch cabs');
    }
  };

  const showModal = (cab?: Cab) => {
    if (cab) {
      setEditingCab(cab);
      form.setFieldsValue({
        ...cab,
        pricePerMinute: parseFloat(cab.pricePerMinute.toString()) // Ensure it's a number
      });
    } else {
      setEditingCab(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formattedValues = {
          name: values.name,
          pricePerMinute: parseFloat(values.pricePerMinute),
          status: values.status,
          description: values.description
        };

        if (editingCab) {
          await axios.put(`/api/cabs/${editingCab._id}`, formattedValues);
          message.success('Cab updated successfully');
        } else {
          await axios.post('/api/cabs', formattedValues);
          message.success('Cab added successfully');
        }
        setIsModalVisible(false);
        fetchCabs();
      } catch (error) {
        message.error('Failed to save cab');
      }
    });
  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/cabs/${id}`);
      message.success('Cab deleted successfully');
      fetchCabs();
    } catch (error) {
      message.error('Failed to delete cab');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Price per Minute',
      dataIndex: 'pricePerMinute',
      key: 'pricePerMinute',
      render: (price: number) => `$${price}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status.charAt(0).toUpperCase() + status.slice(1)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Cab) => (
        <>
          <Button onClick={() => showModal(record)} className="mr-2">Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      )
    }

  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Manage Cabs</Title>
        <Button type="primary" onClick={() => showModal()}>Add New Cab</Button>
      </div>
      <Table columns={columns} dataSource={cabs} rowKey="id" />
      <Modal
        title={editingCab ? "Edit Cab" : "Add New Cab"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            name="pricePerMinute" 
            label="Price per Minute" 
            rules={[{ required: true, message: 'Please input the price per minute!' }]}
          >
            <InputNumber
              min={0}
              step={0.25}
              precision={2}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="unavailable">Unavailable</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAuth(ManageCabs, ['admin']);
