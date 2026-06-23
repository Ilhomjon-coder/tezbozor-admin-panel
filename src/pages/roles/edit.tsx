import { Edit, useForm } from '@refinedev/antd';
import { Alert, Form } from 'antd';
import type { Role } from '../../api/types';
import { RoleFields } from './RoleFields';
import { text } from '../../i18n/uz';

export const RoleEditPage = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Role>();
  const record = queryResult?.data?.data;
  // superadmin is immutable (backend forbids edits) — show it read-only.
  const locked = record?.name === 'superadmin';

  return (
    <Edit saveButtonProps={locked ? { ...saveButtonProps, disabled: true } : saveButtonProps} title={record?.name ?? text.roles.title}>
      {locked ? <Alert type="info" showIcon message={text.roles.superadminLocked} style={{ marginBottom: 16 }} /> : null}
      <Form {...formProps} layout="vertical">
        {/* Name is the stable identifier — not editable after creation. */}
        <RoleFields nameDisabled disabled={locked} />
      </Form>
    </Edit>
  );
};
