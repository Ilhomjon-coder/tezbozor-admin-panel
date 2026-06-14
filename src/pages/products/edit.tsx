import { Edit, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminProduct } from '../../api/types';
import { ProductFields } from './ProductFields';
import { text } from '../../i18n/uz';

export const ProductEditPage = () => {
  const { formProps, saveButtonProps } = useForm<AdminProduct>();

  return (
    <Edit saveButtonProps={saveButtonProps} title={text.products.title}>
      <Form {...formProps} layout="vertical">
        <ProductFields />
      </Form>
    </Edit>
  );
};
