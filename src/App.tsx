import React, { useState } from 'react';
import { Layout, Tabs, theme } from 'antd';
import { AppstoreOutlined, PlusCircleOutlined, SettingOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { RentalProvider } from './context/RentalContext';
import { RentalList } from './components/RentalList';
import { RentalForm } from './components/RentalForm';
import { ReminderSettings } from './components/ReminderSettings';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [activeTab, setActiveTab] = useState('daily');
  const [activeMainTab, setActiveMainTab] = useState('list');

  const listTabItems = [
    {
      key: 'daily',
      label: (
        <span>
          <ClockCircleOutlined />
          按天计租
        </span>
      ),
      children: <RentalList rentalType="daily" />,
    },
    {
      key: 'monthly',
      label: (
        <span>
          <CalendarOutlined />
          按月计租
        </span>
      ),
      children: <RentalList rentalType="monthly" />,
    },
    {
      key: 'all',
      label: (
        <span>
          <AppstoreOutlined />
          全部记录
        </span>
      ),
      children: <RentalList />,
    },
  ];

  const mainTabItems = [
    {
      key: 'list',
      label: (
        <span>
          <AppstoreOutlined />
          租赁列表
        </span>
      ),
      children: (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={listTabItems}
          size="large"
        />
      ),
    },
    {
      key: 'add',
      label: (
        <span>
          <PlusCircleOutlined />
          新增租赁
        </span>
      ),
      children: <RentalForm />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          提醒设置
        </span>
      ),
      children: <ReminderSettings />,
    },
  ];

  return (
    <RentalProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: colorBgContainer,
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            租赁管理系统
          </h1>
        </Header>
        <Content style={{ padding: '24px' }}>
          <div
            style={{
              background: colorBgContainer,
              padding: 24,
              borderRadius: 8,
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <Tabs
              activeKey={activeMainTab}
              onChange={setActiveMainTab}
              items={mainTabItems}
              size="large"
            />
          </div>
        </Content>
      </Layout>
    </RentalProvider>
  );
};

export default App;
