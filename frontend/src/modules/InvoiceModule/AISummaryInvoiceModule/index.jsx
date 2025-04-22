import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';

import PageLoader from '@/components/PageLoader';
import { selectAISummaryItem } from '@/redux/erp/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import AISummaryItem from '@/modules/ErpPanelModule/AISummaryItem';

export default function AISummaryInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectAISummaryItem);

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
          <AISummaryItem config={config} selectedItem={currentResult} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
