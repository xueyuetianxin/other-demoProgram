import React, { useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRental } from '../context/RentalContext';

const { Option } = Select;

export const RentalForm: React.FC = () => {
  const [form] = Form.useForm();
  const { addRental } = useRental();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      addRental({
        tenantName: values.tenantName,
        itemName: values.itemName,
        quantity: values.quantity,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: null,
        deposit: values.deposit,
        otherFees: values.otherFees,
        rent: values.rent,
        rentalType: values.rentalType,
        isSettled: false,
        payments: [],
      });
      message.success('租赁记录添加成功');
      form.resetFields();
    } catch (error) {
      message.error('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="新增租赁" extra={<PlusOutlined />}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          quantity: 1,
          deposit: 0,
          otherFees: 0,
          rentalType: 'daily',
        }}
      >
        <Form.Item
          label="租客姓名"
          name="tenantName"
          rules={[{ required: true, message: '请输入租客姓名' }]}
        >
          <Input placeholder="例如：余xx" />
        </Form.Item>

        <Form.Item
          label="租赁物品"
          name="itemName"
          rules={[{ required: true, message: '请输入租赁物品' }]}
        >
          <Input placeholder="例如：钢板" />
        </Form.Item>

        <Form.Item
          label="数量"
          name="quantity"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：20" />
        </Form.Item>

        <Form.Item
          label="开始日期"
          name="startDate"
          rules={[{ required: true, message: '请选择开始日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="计租方式"
          name="rentalType"
          rules={[{ required: true, message: '请选择计租方式' }]}
        >
          <Select>
            <Option value="daily">按天计算</Option>
            <Option value="monthly">按月计算</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="货价"
          name="deposit"
          rules={[{ required: true, message: '请输入货价金额' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="例如：10000" />
        </Form.Item>

        <Form.Item
          label="租金"
          name="rent"
          rules={[{ required: true, message: '请输入租金' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="例如：4000" />
        </Form.Item>

        <Form.Item
          label="其他费用"
          name="otherFees"
          rules={[{ required: true, message: '请输入其他费用' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="例如：800" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            添加租赁
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
