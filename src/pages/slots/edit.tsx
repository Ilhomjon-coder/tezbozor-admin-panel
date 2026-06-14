import { Edit, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminSlot } from '../../api/types';
import { SlotFields } from './SlotFields';
import { text } from '../../i18n/uz';

export const SlotEditPage = () => {
  const { formProps, saveButtonProps } = useForm<AdminSlot>();

  return (
    <Edit saveButtonProps={saveButtonProps} title={text.slots.title}>
      <Form {...formProps} layout="vertical">
        <SlotFields />
      </Form>
    </Edit>
  );
};
