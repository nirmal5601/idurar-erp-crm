import { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Select, Divider, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import useLanguage from '@/locale/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import Loading from '@/components/Loading';
import { CloseCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { generate as uniqueId } from 'shortid';

export default function UpdateQuery({ config }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { entity } = config;

  const [form] = Form.useForm();

  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (current) {
      const formData = {
        ...current,
        client: current.client?._id || current.client,
      };
      form.setFieldsValue(formData);

      setNotes(current.notes || []);
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
      notes,
    };
    dispatch(erp.update({ entity, id, jsonData: payload }));
  };

  // Add a new note field
  const addNoteField = () => {
    setNotes((prevNotes) => [...prevNotes, { id: null, content: '' }]);
  };

  // Handle note content change
  const handleNoteChange = (value, index) => {
    const newNotes = [...notes];
    newNotes[index].content = value;
    setNotes(newNotes);
  };

  // Remove a note field
  const removeNoteField = (index) => {
    setNotes((prevNotes) => prevNotes.filter((_, idx) => idx !== index));
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

            <Col xs={24}>
              <Form.Item label={translate('Notes')} rules={[{ required: false }]}>
                {notes.map((note, index) => (
                  <Row key={index} gutter={[4, 8]} style={{ marginBottom: '4px' }}>
                    <Col xs={22}>
                      <Form.Item
                        name={['notes', index, 'content']}
                        initialValue={note.content}
                        style={{ marginBottom: '0' }}
                      >
                        <Input.TextArea
                          rows={2}
                          value={note.content}
                          onChange={(e) => handleNoteChange(e.target.value, index)}
                          placeholder={translate('Additional notes')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={2}>
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => removeNoteField(index)}
                        block
                        style={{ padding: '0 4px', height: '50px', width: '50px' }}
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addNoteField}
                  style={{ width: '100%' }}
                >
                  {translate('Add Note')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Loading>
    </>
  );
}
