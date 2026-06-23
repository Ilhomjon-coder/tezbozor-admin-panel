import { useState } from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { App, Button, Form, Input, Modal, Select, Switch } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import type { AdminUser, Role } from '../../api/types';
import { ApiError, apiFetch } from '../../api/http';
import { text } from '../../i18n/uz';

export const AdminEditPage = () => {
  const { message } = App.useApp();
  const { formProps, saveButtonProps, queryResult } = useForm<AdminUser>();
  const record = queryResult?.data?.data;
  const { selectProps: roleSelect } = useSelect<Role>({
    resource: 'roles',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: { mode: 'off' },
  });

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [saving, setSaving] = useState(false);

  const resetPassword = async () => {
    if (!record || pw.length < 8) return;
    setSaving(true);
    try {
      await apiFetch(`/admin/admins/${record.id}/password`, {
        method: 'POST',
        body: JSON.stringify({ password: pw }),
      });
      message.success(text.admins.resetPasswordOk);
      setPwOpen(false);
      setPw('');
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      title={record?.username ?? text.admins.title}
      headerButtons={
        <Button icon={<KeyOutlined />} onClick={() => setPwOpen(true)}>
          {text.admins.resetPassword}
        </Button>
      }
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label={text.admins.username}>
          <Input value={record?.username} disabled />
        </Form.Item>
        <Form.Item label={text.admins.role} name="roleId" rules={[{ required: true }]}>
          <Select {...roleSelect} />
        </Form.Item>
        <Form.Item label={text.admins.active} name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>

      <Modal
        open={pwOpen}
        title={text.admins.resetPassword}
        okText={text.admins.resetPasswordCta}
        cancelText={text.common.cancel}
        confirmLoading={saving}
        okButtonProps={{ disabled: pw.length < 8 }}
        onOk={resetPassword}
        onCancel={() => setPwOpen(false)}
      >
        <Input.Password
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={text.admins.newPassword}
          autoComplete="new-password"
        />
      </Modal>
    </Edit>
  );
};
