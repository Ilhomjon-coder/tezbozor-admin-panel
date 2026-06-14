import { Form, Input, InputNumber, Select, Switch } from 'antd';
import { useSelect } from '@refinedev/antd';
import type { AdminCategory } from '../../api/types';
import { ImageUpload } from '../../components/ImageUpload';
import { productBadgeLabel, text, unitLabel } from '../../i18n/uz';

// Shared product create/edit fields. On edit, Refine's useForm seeds initial
// values from the loaded record; on create the per-field initialValue applies.
export const ProductFields = () => {
  const { selectProps: categorySelectProps } = useSelect<AdminCategory>({
    resource: 'categories',
    optionLabel: 'nameUz',
    optionValue: 'id',
    pagination: { mode: 'off' },
  });

  return (
    <>
      <Form.Item label={text.products.name} name="nameUz" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label={text.products.category} name="categoryId" rules={[{ required: true }]}>
        <Select {...categorySelectProps} />
      </Form.Item>

      <Form.Item label={text.products.unit} name="unit" rules={[{ required: true }]} initialValue="kg">
        <Select
          options={[
            { value: 'kg', label: unitLabel.kg },
            { value: 'dona', label: unitLabel.dona },
          ]}
        />
      </Form.Item>

      <Form.Item label={text.products.badge} name="badge">
        <Select
          allowClear
          placeholder={text.products.noBadge}
          options={[
            { value: 'yangi_keldi', label: productBadgeLabel.yangi_keldi },
            { value: 'narxi_barqaror', label: productBadgeLabel.narxi_barqaror },
          ]}
        />
      </Form.Item>

      <Form.Item label={text.products.image} name="imageUrl">
        <ImageUpload />
      </Form.Item>

      <Form.Item label={text.products.active} name="isActive" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>

      <Form.Item label={text.products.productOfDay} name="isProductOfDay" valuePropName="checked" initialValue={false}>
        <Switch />
      </Form.Item>

      <Form.Item label={text.products.sortOrder} name="sortOrder" initialValue={0}>
        <InputNumber min={0} style={{ width: 140 }} />
      </Form.Item>
    </>
  );
};
