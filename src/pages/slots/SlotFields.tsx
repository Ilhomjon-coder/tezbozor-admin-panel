import { Form, InputNumber, Select, Switch } from 'antd';
import { DateInput } from '../../components/DateInput';
import { SLOT_LABELS } from '../../lib/constants';
import { text } from '../../i18n/uz';

// Only the two contract slot labels are selectable — the backend rejects anything
// else, and SLOT_LABELS is typed against the contract so it can't drift.
export const SlotFields = () => (
  <>
    <Form.Item label={text.slots.date} name="date" rules={[{ required: true }]}>
      <DateInput />
    </Form.Item>
    <Form.Item label={text.slots.label} name="label" rules={[{ required: true }]}>
      <Select options={SLOT_LABELS.map((l) => ({ value: l, label: l }))} style={{ width: 200 }} />
    </Form.Item>
    <Form.Item label={text.slots.capacity} name="capacity" rules={[{ required: true }]} initialValue={20}>
      <InputNumber min={0} style={{ width: 140 }} />
    </Form.Item>
    <Form.Item label={text.slots.isOpen} name="isOpen" valuePropName="checked" initialValue={true}>
      <Switch />
    </Form.Item>
  </>
);
