import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NotFound from '@/components/NotFound';
import PageLoader from '@/components/PageLoader';

import { ErpLayout } from '@/layout';

import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';

import QueryForm from '../Forms/QueryForm';
import UpdateQuery from '../UpdateItem/UpdateQuery';

export default function UpdateQueryModule({ config }) {
  const dispatch = useDispatch();

  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult }));
    }
  }, [currentResult]);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <UpdateQuery config={config} UpdateForm={QueryForm} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
