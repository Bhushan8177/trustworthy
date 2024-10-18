import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Typography } from 'antd';
import axios from 'axios';
import withAuth from '../components/withAuth';

const { Title } = Typography;

interface Cab {
  id: string;
  name: string;
  pricePerMinute: number;
}

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
      form.setFieldsValue(cab);
    } else {
      setEditingCab(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingCab) {
          await axios.put(`/api/cabs/${editingCab.id}`, values);
          message.success('Cab updated successfully');
        } else {
          await axios.post('/api/cabs', values);
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
      key: 'name',
    },
    {
      title: 'Price per Minute',
      dataIndex: 'pricePerMinute',
      key: 'pricePerMinute',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Cab) => (
        <>
          <Button onClick={() => showModal(record)} className="mr-2">Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
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
          <Form.Item name="pricePerMinute" label="Price per Minute" rules={[{ required: true, type: 'number', min: 0 }]}>
            <Input type="number" step="0.01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAuth(ManageCabs, ['admin']);
