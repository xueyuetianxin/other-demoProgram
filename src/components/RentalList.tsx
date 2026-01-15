import React, { useState } from 'react';
import { Table, Tag, Button, Space, Popconfirm, Card, Statistic, Row, Col, Modal, Drawer, Input } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, PayCircleOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import { useRental } from '../context/RentalContext';
import { calculateBalance, formatCurrency, calculateDailyPaid, calculateMonthlyPaid, checkDailyPaymentComplete, checkMonthlyPaymentComplete, calculateProfit } from '../utils/calculator';
import dayjs from 'dayjs';
import { RentalType } from '../types';
import { PaymentForm } from './PaymentForm';
import { PaymentHistory } from './PaymentHistory';

interface RentalListProps {
  rentalType?: RentalType;
}

export const RentalList: React.FC<RentalListProps> = ({ rentalType }) => {
  const { rentals, deleteRental, settleRental } = useRental();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredRentals = rentalType 
    ? rentals.filter(r => r.rentalType === rentalType)
    : rentals;

  const searchedRentals = searchText
    ? filteredRentals.filter(r => r.tenantName.includes(searchText))
    : filteredRentals;

  const today = dayjs().format('YYYY-MM-DD');

  const sortedRentals = [...searchedRentals].sort((a, b) => {
    if (a.isSettled !== b.isSettled) {
      return a.isSettled ? 1 : -1;
    }
    
    const aPaid = a.rentalType === 'daily' 
      ? calculateDailyPaid(a, today) 
      : calculateMonthlyPaid(a, today);
    const bPaid = b.rentalType === 'daily' 
      ? calculateDailyPaid(b, today) 
      : calculateMonthlyPaid(b, today);
    
    return aPaid - bPaid;
  });

  const unsettledRentals = filteredRentals.filter(r => !r.isSettled);
  const totalBalance = unsettledRentals.reduce((sum, r) => sum + calculateBalance(r), 0);
  const totalProfit = filteredRentals.reduce((sum, r) => sum + calculateProfit(r), 0);

  const handlePayment = (rentalId: string) => {
    setSelectedRentalId(rentalId);
    setPaymentModalVisible(true);
  };

  const handleViewHistory = (rentalId: string) => {
    setSelectedRentalId(rentalId);
    setHistoryDrawerVisible(true);
  };

  const columns = [
    {
      title: '租客姓名',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 120,
    },
    {
      title: '租赁物品',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '归还日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date: string | null) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '计租方式',
      dataIndex: 'rentalType',
      key: 'rentalType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'daily' ? 'blue' : 'green'}>
          {type === 'daily' ? '按天' : '按月'}
        </Tag>
      ),
    },
    {
      title: '货价',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 100,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '租金',
      dataIndex: 'rent',
      key: 'rent',
      width: 100,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '其他费用',
      dataIndex: 'otherFees',
      key: 'otherFees',
      width: 100,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '应付额',
      key: 'balance',
      width: 120,
      render: (_: any, record: any) => {
        const balance = calculateBalance(record);
        return (
          <span style={{ color: balance > 0 ? '#ff4d4f' : '#52c41a' }}>
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      title: '盈利额',
      key: 'profit',
      width: 120,
      render: (_: any, record: any) => {
        const profit = calculateProfit(record);
        return (
          <span style={{ color: profit > 0 ? '#52c41a' : '#ff4d4f' }}>
            {formatCurrency(profit)}
          </span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'isSettled',
      key: 'isSettled',
      width: 100,
      render: (settled: boolean) => (
        <Tag color={settled ? 'success' : 'warning'}>
          {settled ? '已结清' : '未结清'}
        </Tag>
      ),
    },
    {
      title: '还款状态',
      key: 'paymentStatus',
      width: 120,
      render: (_: any, record: any) => {
        if (record.isSettled) return <Tag color="success">已完成</Tag>;
        
        if (record.rentalType === 'daily') {
          const dailyPaid = calculateDailyPaid(record, today);
          const isComplete = checkDailyPaymentComplete(record, today);
          return (
            <Tag color={isComplete ? 'success' : 'warning'}>
              {isComplete ? '当日已还' : `当日: ¥${dailyPaid}`}
            </Tag>
          );
        } else {
          const monthlyPaid = calculateMonthlyPaid(record, today);
          const isComplete = checkMonthlyPaymentComplete(record, today);
          return (
            <Tag color={isComplete ? 'success' : 'warning'}>
              {isComplete ? '当月已还' : `当月: ¥${monthlyPaid}`}
            </Tag>
          );
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: any) => (
        <Space size="small">
          {!record.isSettled && (
            <Button 
              type="primary" 
              size="small" 
              icon={<PayCircleOutlined />}
              onClick={() => handlePayment(record.id)}
            >
              还款
            </Button>
          )}
          <Button 
            size="small" 
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record.id)}
          >
            历史
          </Button>
          {!record.isSettled && (
            <Popconfirm
              title="确认结算？"
              onConfirm={() => settleRental(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircleOutlined />}
              >
                结算
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确认删除？"
            onConfirm={() => deleteRental(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button 
              type="primary" 
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
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <Input
              placeholder="输入租客姓名搜索"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="未结清账目"
              value={unsettledRentals.length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待收余额"
              value={totalBalance}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="盈利额"
              value={totalProfit}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Table
        columns={columns}
        dataSource={sortedRentals}
        rowKey="id"
        scroll={{ x: 2000 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title="添加还款"
        open={paymentModalVisible}
        onCancel={() => {
          setPaymentModalVisible(false);
          setSelectedRentalId(null);
        }}
        footer={null}
        width={500}
      >
        {selectedRentalId && (
          <PaymentForm
            rentalId={selectedRentalId}
            rentalType={rentals.find(r => r.id === selectedRentalId)?.rentalType || 'daily'}
            onClose={() => {
              setPaymentModalVisible(false);
              setSelectedRentalId(null);
            }}
          />
        )}
      </Modal>

      <Drawer
        title="还款历史"
        open={historyDrawerVisible}
        onClose={() => {
          setHistoryDrawerVisible(false);
          setSelectedRentalId(null);
        }}
        width={600}
      >
        {selectedRentalId && <PaymentHistory rentalId={selectedRentalId} />}
      </Drawer>
    </div>
  );
};
