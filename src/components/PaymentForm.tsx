import React from 'react';
import { Form, InputNumber, DatePicker, Select, Button, Card, Input, message } from 'antd';
import { PayCircleOutlined } from '@ant-design/icons';
import { useRental } from '../context/RentalContext';
import dayjs from 'dayjs';

const { Option } = Select;

interface PaymentFormProps {
  rentalId: string;
  rentalType: 'daily' | 'monthly';
  onClose?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ rentalId, rentalType, onClose }) => {
  const [form] = Form.useForm();
  const { addPayment } = useRental();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      addPayment(rentalId, {
        amount: values.amount,
        date: values.date.format('YYYY-MM-DD'),
        type: values.type,
        notes: values.notes,
      });
      message.success('还款记录添加成功');
      form.resetFields();
      onClose?.();
    } catch (error) {
      message.error('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="添加还款" extra={<PayCircleOutlined />}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: rentalType,
          date: dayjs(),
        }}
      >
        <Form.Item
          label="还款类型"
          name="type"
          rules={[{ required: true, message: '请选择还款类型' }]}
        >
          <Select>
            <Option value="daily">当日还款</Option>
            <Option value="monthly">当月还款</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="还款金额"
          name="amount"
          rules={[{ required: true, message: '请输入还款金额' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="例如：4000" />
        </Form.Item>

        <Form.Item
          label="还款日期"
          name="date"
          rules={[{ required: true, message: '请选择还款日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="备注"
          name="notes"
        >
          <Input.TextArea rows={3} placeholder="可选备注信息" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            确认还款
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
