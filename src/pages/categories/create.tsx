import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminCategory } from '../../api/types';
import { CategoryFields } from './CategoryFields';
import { text } from '../../i18n/uz';

export const CategoryCreatePage = () => {
  const { formProps, saveButtonProps } = useForm<AdminCategory>();

  return (
    <Create saveButtonProps={saveButtonProps} title={text.categories.title}>
      <Form {...formProps} layout="vertical">
        <CategoryFields />
      </Form>
    </Create>
  );
};
