import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';

import { useMoney, useDate } from '@/settings';
import QueryDataTableModule from '@/modules/QueryModule/QueryDataTableModule';
import { Tag, Tooltip } from 'antd';


export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'query';

  const statusColors = {
    Open: 'green',
    Closed: 'red',
    InProgress: 'blue',
  };

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const dataTableColumns = [
    {
      title: translate('Customer Name'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Description'),
      dataIndex: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
       render: (status) => (
        <Tag color={statusColors[status] || 'gray'}>
          {status}
        </Tag>
      ),
    },
    {
      title: translate('Created Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Resolution'),
      dataIndex: 'resolution',
      ellipsis: true, // enables CSS truncation
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('query'),
    DATATABLE_TITLE: translate('query_list'),
    ADD_NEW_ENTITY: translate('add_new_query'),
    ENTITY_NAME: translate('query'),

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
  };

  return <QueryDataTableModule config={config} />;
}
