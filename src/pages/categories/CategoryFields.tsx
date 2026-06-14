import { Form, Input, InputNumber } from 'antd';
import { text } from '../../i18n/uz';

export const CategoryFields = () => (
  <>
    <Form.Item label={text.categories.name} name="nameUz" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item
      label={text.categories.slug}
      name="slug"
      rules={[
        { required: true },
        { pattern: /^[a-z0-9-]+$/, message: 'a-z, 0-9, -' },
      ]}
    >
      <Input placeholder="sabzavot" />
    </Form.Item>
    <Form.Item label={text.categories.sortOrder} name="sortOrder" initialValue={0}>
      <InputNumber min={0} style={{ width: 140 }} />
    </Form.Item>
  </>
);
