import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Card, Space, message } from 'antd';
import { useRental } from '../context/RentalContext';
import dayjs from 'dayjs';

export const RentalDetail: React.FC<{ id: string }> = ({ id }) => {
  const { rentals, updateRental } = useRental();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const rental = rentals.find(r => r.id === id);

  React.useEffect(() => {
    if (rental) {
      form.setFieldsValue({
        ...rental,
        startDate: dayjs(rental.startDate),
        endDate: rental.endDate ? dayjs(rental.endDate) : null,
      });
    }
  }, [rental, form]);

  if (!rental) {
    return <div>未找到租赁记录</div>;
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      updateRental(id, {
        tenantName: values.tenantName,
        itemName: values.itemName,
        quantity: values.quantity,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        deposit: values.deposit,
        otherFees: values.otherFees,
        rent: values.rent,
        rentalType: values.rentalType,
      });
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="编辑租赁">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="租客姓名"
          name="tenantName"
          rules={[{ required: true, message: '请输入租客姓名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="租赁物品"
          name="itemName"
          rules={[{ required: true, message: '请输入租赁物品' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="数量"
          name="quantity"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="开始日期"
          name="startDate"
          rules={[{ required: true, message: '请选择开始日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="归还日期"
          name="endDate"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="计租方式"
          name="rentalType"
          rules={[{ required: true, message: '请选择计租方式' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="押金"
          name="deposit"
          rules={[{ required: true, message: '请输入押金金额' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="租金"
          name="rent"
          rules={[{ required: true, message: '请输入租金' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="其他费用"
          name="otherFees"
          rules={[{ required: true, message: '请输入其他费用' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
