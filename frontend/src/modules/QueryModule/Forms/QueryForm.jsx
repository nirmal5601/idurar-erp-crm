import { Row, Col, Select, Input, Form } from 'antd';
import useLanguage from '@/locale/useLanguage';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

export default function QueryForm({ subTotal, offerTotal }) {
  const translate = useLanguage();

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Form.Item
            name="client"
            label={translate('Client')}
            rules={[{ required: true, message: 'Please select a client' }]}
          >
            <AutoCompleteAsync
              entity={'client'}
              displayLabels={['name']}
              searchFields={'name'}
              redirectLabel={translate('Add New Client')}
              withRedirect
              urlToRedirect={'/customer'}
              placeholder="Search client"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={translate('Status')}
            name="status"
            rules={[{ required: true }]}
            initialValue="Open"
          >
            <Select placeholder="Select status">
              <Select.Option value="Open">Open</Select.Option>
              <Select.Option value="Closed">Closed</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Form.Item
            label={translate('Description')}
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={translate('Resolution')}
            name="resolution"
            rules={[{ required: true, message: 'Please enter resolution' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter resolution" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
