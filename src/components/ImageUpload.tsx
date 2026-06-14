import { App, Button, Space, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { apiFetch } from '../api/http';
import { assetUrl } from '../lib/assets';
import { text } from '../i18n/uz';

// Form control for a product image. Uploads to POST /admin/uploads (multipart),
// stores the returned server-relative URL as the field value. Designed to sit
// inside an AntD <Form.Item name="imageUrl"> — Form injects value/onChange.
export const ImageUpload = ({
  value,
  onChange,
}: {
  value?: string | null;
  onChange?: (url: string | null) => void;
}) => {
  const { message } = App.useApp();
  const preview = assetUrl(value);

  return (
    <Space direction="vertical">
      {preview && (
        <img
          src={preview}
          alt=""
          style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
        />
      )}
      <Space>
        <Upload
          accept="image/png,image/jpeg,image/webp"
          maxCount={1}
          showUploadList={false}
          customRequest={async ({ file, onSuccess, onError }) => {
            const fd = new FormData();
            fd.append('file', file as File);
            try {
              const res = await apiFetch<{ url: string }>('/admin/uploads', { method: 'POST', body: fd });
              onChange?.(res.url);
              onSuccess?.(res);
            } catch (e) {
              message.error(text.common.error);
              onError?.(e as Error);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>{text.products.uploadImage}</Button>
        </Upload>
        {value && (
          <Button icon={<DeleteOutlined />} danger onClick={() => onChange?.(null)}>
            {text.common.delete}
          </Button>
        )}
      </Space>
    </Space>
  );
};
