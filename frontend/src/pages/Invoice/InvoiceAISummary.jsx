import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AISummaryInvoiceModule from '@/modules/InvoiceModule/AISummaryInvoiceModule';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

export default function InvoiceAISSummary() {
  const entity = 'invoice';
  const { id } = useParams();
  const translate = useLanguage();
  const dispatch = useDispatch();

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  useEffect(() => {
    dispatch(erp.aiSummary({ entity, id }));
  }, [id, dispatch]);

  return <AISummaryInvoiceModule config={configPage} />;
}
