import React from 'react';
import { Table, Tag, Button, Space, Popconfirm, Card, Modal, InputNumber, DatePicker, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRental } from '../context/RentalContext';
import { Payment } from '../types';
import { formatCurrency } from '../utils/calculator';
import dayjs from 'dayjs';

interface PaymentHistoryProps {
  rentalId: string;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ rentalId }) => {
  const { rentals, updatePayment, deletePayment } = useRental();
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<Payment>>({});

  const rental = rentals.find(r => r.id === rentalId);
  const payments = rental?.payments || [];

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setEditForm({
      amount: payment.amount,
      date: payment.date,
      type: payment.type,
      notes: payment.notes,
    });
  };

  const handleSaveEdit = () => {
    if (!editingPayment) return;
    
    updatePayment(rentalId, editingPayment.id, editForm);
    message.success('还款记录已更新');
    setEditingPayment(null);
    setEditForm({});
  };

  const handleDelete = (paymentId: string) => {
    deletePayment(rentalId, paymentId);
    message.success('还款记录已删除');
  };

  const columns = [
    {
      title: '还款日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '还款类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'daily' ? 'blue' : 'green'}>
          {type === 'daily' ? '当日' : '当月'}
        </Tag>
      ),
    },
    {
      title: '还款金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Payment) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="还款历史">
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title="编辑还款"
        open={!!editingPayment}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditingPayment(null);
          setEditForm({});
        }}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>还款类型</label>
          <select
            style={{ width: '100%', padding: 8 }}
            value={editForm.type}
            onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
          >
            <option value="daily">当日还款</option>
            <option value="monthly">当月还款</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>还款金额</label>
          <InputNumber
            style={{ width: '100%' }}
            value={editForm.amount}
            onChange={(value) => setEditForm({ ...editForm, amount: value || 0 })}
            min={0}
            precision={2}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>还款日期</label>
          <DatePicker
            style={{ width: '100%' }}
            value={editForm.date ? dayjs(editForm.date) : null}
            onChange={(date) => setEditForm({ ...editForm, date: date?.format('YYYY-MM-DD') })}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>备注</label>
          <Input.TextArea
            rows={3}
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
          />
        </div>
      </Modal>
    </Card>
  );
};
