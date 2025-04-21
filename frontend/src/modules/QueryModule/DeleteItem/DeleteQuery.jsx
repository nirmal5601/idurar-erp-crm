import { Modal, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function DeleteQuery({ id, entity = 'query' }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: translate('Are you sure you want to delete this query?'),
      icon: <ExclamationCircleOutlined />,
      okText: translate('Yes'),
      okType: 'danger',
      cancelText: translate('No'),
      onOk: async () => {
        setLoading(true);
        try {
          await dispatch(erp.delete({ entity, id }));
          Modal.success({
            title: translate('Deleted'),
            content: translate('Query deleted successfully'),
            onOk: () => navigate(`/${entity}`),
          });
        } catch (error) {
          Modal.error({
            title: translate('Error'),
            content: translate('Failed to delete query'),
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Button type="primary" danger onClick={showDeleteConfirm} loading={loading}>
      {translate('Delete')}
    </Button>
  );
}
