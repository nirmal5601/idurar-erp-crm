import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, Divider} from 'antd';

import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { erp } from '@/redux/erp/actions';
import { selectCurrentItem } from '@/redux/erp/selectors';

import useLanguage from '@/locale/useLanguage';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';


export default function AISummaryItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { send, isLoading: mailInProgress } = useMail({ entity });

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);

  useEffect(() => {
    if (currentResult) {
      const { items, invoice, ...others } = currentResult;
      setCurrentErp((prevErp) => ({ ...prevErp, ...others }));
    }

    return () => {
      setCurrentErp(resetErp); 
    };
  }, [currentResult]);


  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME} # ${currentErp?.number}/${currentErp?.year || ''}`}
        ghost={false}
        tags={[
          <span key="status">{currentErp?.status && translate(currentErp.status)}</span>,
          currentErp?.paymentStatus && (
            <span key="paymentStatus">
              {currentErp?.paymentStatus && translate(currentErp.paymentStatus)}
            </span>
          ),
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp?._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            {translate('Download PDF')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            loading={mailInProgress}
            onClick={() => {
              send(currentErp?._id);
            }}
            icon={<MailOutlined />}
          >
            {translate('Send by Email')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(erp.convert({ entity, id: currentErp?._id }));
            }}
            icon={<RetweetOutlined />}
            style={{ display: entity === 'quote' ? 'inline-block' : 'none' }}
          >
            {translate('Convert to Invoice')}
          </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp?._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
      </PageHeader>
      <Divider dashed />

      <Row>
        <Col span={24}>
          <h2 style={{ fontWeight: 'bold', color: '#4c8bf5' }}>{translate('AI Summary')}</h2>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              fontSize: '14px',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {currentErp?.aiSummary ? currentErp.aiSummary : 'No AI summary available'}
          </pre>
          <p style={{ fontStyle: 'italic', color: '#888' }}>
            {translate('This is the generated AI summary based on the current data.')}
          </p>
        </Col>
      </Row>
    </>
  );
}

