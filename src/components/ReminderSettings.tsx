import React from 'react';
import { Form, Switch, TimePicker, InputNumber, Card, Button, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useRental } from '../context/RentalContext';
import dayjs from 'dayjs';

export const ReminderSettings: React.FC = () => {
  const { reminderSettings, updateReminderSettings } = useRental();
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      ...reminderSettings,
      dailyTime: dayjs(reminderSettings.dailyTime, 'HH:mm'),
    });
  }, [reminderSettings, form]);

  const handleSubmit = (values: any) => {
    updateReminderSettings({
      enabled: values.enabled,
      dailyReminder: values.dailyReminder,
      dailyTime: values.dailyTime.format('HH:mm'),
      monthlyReminder: values.monthlyReminder,
      monthlyDay: values.monthlyDay,
    });
    message.success('提醒设置已保存');
  };

  return (
    <Card title="提醒设置" extra={<BellOutlined />}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="启用提醒"
          name="enabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="每日提醒"
          name="dailyReminder"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="每日提醒时间"
          name="dailyTime"
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="每月提醒"
          name="monthlyReminder"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="每月提醒日期"
          name="monthlyDay"
        >
          <InputNumber min={1} max={28} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
