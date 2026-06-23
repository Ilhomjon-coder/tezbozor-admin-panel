import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { Role } from '../../api/types';
import { RoleFields } from './RoleFields';
import { text } from '../../i18n/uz';

export const RoleCreatePage = () => {
  const { formProps, saveButtonProps } = useForm<Role>();

  return (
    <Create saveButtonProps={saveButtonProps} title={text.roles.add}>
      <Form {...formProps} layout="vertical" initialValues={{ permissions: [] }}>
        <RoleFields />
      </Form>
    </Create>
  );
};
