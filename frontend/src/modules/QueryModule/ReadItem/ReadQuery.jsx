import { useNavigate } from 'react-router-dom';
import { Descriptions, Divider } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '@ant-design/pro-layout';
import useLanguage from '@/locale/useLanguage';

export default function ReadQuery({ config, selectedItem }) {
  const translate = useLanguage();
  const navigate = useNavigate();
  const { entity } = config;

  const {
    status,
    description,
    resolution,
    createdAt,
    client = {},
    notes = [],
  } = selectedItem || {};

  // Mapping notes to print them one after another with "Note1:", "Note2:", etc.
  const notesContent = notes?.map((note, index) => (
    <p key={index}><strong>{`Note ${index + 1}:`}</strong> {note.content}</p>
  ));

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/${entity.toLowerCase()}`)}
        title={translate('Query Details')}
        ghost={false}
        style={{ padding: '20px 0' }}
      />

      <Divider dashed />

      <Descriptions
        title={translate('Client Info')}
        bordered
        column={1}
        style={{ marginBottom: 32 }}
      >
        <Descriptions.Item label={translate('Client Name')}>
          {client.name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Email')}>
          {client.email || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>
          {client.phone || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Address')}>
          {client.address || 'N/A'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={translate('Query Info')} bordered column={1} style={{ marginBottom: 32 }}>
        <Descriptions.Item label={translate('Status')}>
          {status || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Description')}>
          {description || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Resolution')}>
          {resolution || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Created At')}>
          {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={translate('Notes')} bordered column={1}>
        <Descriptions.Item label={translate('Notes')}>
          {notesContent.length > 0 ? notesContent : 'No notes available'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
