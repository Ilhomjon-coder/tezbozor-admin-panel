import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import type { AdminProduct } from '../../api/types';
import { ProductFields } from './ProductFields';
import { text } from '../../i18n/uz';

export const ProductCreatePage = () => {
  const { formProps, saveButtonProps } = useForm<AdminProduct>();

  return (
    <Create saveButtonProps={saveButtonProps} title={text.products.title}>
      <Form {...formProps} layout="vertical">
        <ProductFields />
      </Form>
    </Create>
  );
};
