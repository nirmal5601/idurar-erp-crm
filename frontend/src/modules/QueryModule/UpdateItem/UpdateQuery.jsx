import { useEffect } from 'react';
import { Form, Row, Col, Input, Select, Divider, Button } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '@ant-design/pro-layout';
import useLanguage from '@/locale/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import Loading from '@/components/Loading';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { generate as uniqueId } from 'shortid';

export default function UpdateQuery({ config }) {
  const { entity } = config;
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  useEffect(() => {
    if (current) {
      const formData = {
        ...current,
        client: current.client?._id || current.client,
      };
      form.setFieldsValue(formData);
    }
  }, [current]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'update' }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  const onSubmit = (values) => {
    const payload = {
      ...values,
      client: typeof values.client === 'object' ? values.client._id : values.client,
    };
    dispatch(erp.update({ entity, id, jsonData: payload }));
  };

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/${entity.toLowerCase()}`)}
        title={translate('Update')}
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => form.submit()}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Update')}
          </Button>,
        ]}
        style={{ padding: '20px 0' }}
      />

      <Divider dashed />

      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                label={translate('Client')}
                name="client"
                rules={[{ required: true, message: 'Client is required' }]}
              >
                <AutoCompleteAsync
                  entity="client"
                  displayLabels={['name']}
                  searchFields="name"
                  withRedirect
                  urlToRedirect="/customer"
                  redirectLabel={translate('Add New Client')}
                  placeholder="Select client"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={translate('Status')}
                name="status"
                rules={[{ required: true }]}
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
                rules={[{ required: true, message: 'Description is required' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={translate('Resolution')}
                name="resolution"
                rules={[{ required: true, message: 'Resolution is required' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter resolution" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Loading>
    </>
  );
}
