import { Edit, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminCategory } from '../../api/types';
import { CategoryFields } from './CategoryFields';
import { text } from '../../i18n/uz';

export const CategoryEditPage = () => {
  const { formProps, saveButtonProps } = useForm<AdminCategory>();

  return (
    <Edit saveButtonProps={saveButtonProps} title={text.categories.title}>
      <Form {...formProps} layout="vertical">
        <CategoryFields />
      </Form>
    </Edit>
  );
};
