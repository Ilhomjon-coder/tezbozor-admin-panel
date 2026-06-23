import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Select } from 'antd';
import type { AdminUser, Role } from '../../api/types';
import { text } from '../../i18n/uz';

export const AdminCreatePage = () => {
  const { formProps, saveButtonProps } = useForm<AdminUser>();
  const { selectProps: roleSelect } = useSelect<Role>({
    resource: 'roles',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: { mode: 'off' },
  });

  return (
    <Create saveButtonProps={saveButtonProps} title={text.admins.add}>
      <Form {...formProps} layout="vertical">
        <Form.Item label={text.admins.username} name="username" rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label={text.admins.password} name="password" rules={[{ required: true, min: 8 }]}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item label={text.admins.role} name="roleId" rules={[{ required: true }]}>
          <Select {...roleSelect} />
        </Form.Item>
      </Form>
    </Create>
  );
};
