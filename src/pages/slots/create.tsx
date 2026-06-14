import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminSlot } from '../../api/types';
import { SlotFields } from './SlotFields';
import { text } from '../../i18n/uz';

export const SlotCreatePage = () => {
  const { formProps, saveButtonProps } = useForm<AdminSlot>();

  return (
    <Create saveButtonProps={saveButtonProps} title={text.slots.title}>
      <Form {...formProps} layout="vertical">
        <SlotFields />
      </Form>
    </Create>
  );
};
