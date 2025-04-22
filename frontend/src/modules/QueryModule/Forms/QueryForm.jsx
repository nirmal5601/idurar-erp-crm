import { useState, useEffect } from 'react';
import { Row, Col, Select, Input, Form, Button, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import useLanguage from '@/locale/useLanguage';

export default function QueryForm({ current = null, form, onSubmit }) {
  const translate = useLanguage();
  const [notes, setNotes] = useState([{ id: uuidv4(), content: '' }]);

  const addNoteField = () => {
    setNotes((prevNotes) => [...prevNotes, { id: uuidv4(), content: '' }]);
  };

  const handleNoteChange = (value, index) => {
    const newNotes = [...notes];
    newNotes[index].content = value;
    setNotes(newNotes);
  };

  const removeNoteField = (index) => {
    const newNotes = notes.filter((_, idx) => idx !== index);
    setNotes(newNotes);
    console.log(newNotes);
    form.setFieldsValue({
      notes: newNotes,
    });
  };

  useEffect(() => {
    if (form && current) {
      form.setFieldsValue({
        status: current?.status || 'Open',
        ...current,
        notes: current?.notes || [{ id: uuidv4(), content: '' }],
      });
      setNotes(current?.notes || [{ id: uuidv4(), content: '' }]);
    }
  }, [current, form]);

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
      <Row gutter={[24, 24]}>
        <Col xs={24} >
          <Form.Item label={translate('Notes')} rules={[{ required: false }]}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                justifyContent: "center"
              }}>
              {notes?.map((note, index) => (
                <Row key={note.id} gutter={[4, 8]} style={{ marginBottom: '4px' }}>
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
                style={{ width: '50%', margin: "auto" }}
              >
                {translate('Add Note')}
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
