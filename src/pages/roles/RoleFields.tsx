import { Form, Input } from 'antd';
import { PermissionPicker } from './PermissionPicker';
import { text } from '../../i18n/uz';

export const RoleFields = ({ nameDisabled, disabled }: { nameDisabled?: boolean; disabled?: boolean }) => (
  <>
    <Form.Item label={text.roles.name} name="name" rules={[{ required: true }]}>
      <Input disabled={nameDisabled || disabled} />
    </Form.Item>
    <Form.Item label={text.roles.description} name="description">
      <Input disabled={disabled} />
    </Form.Item>
    <Form.Item label={text.roles.permissions} name="permissions">
      <PermissionPicker disabled={disabled} />
    </Form.Item>
  </>
);
