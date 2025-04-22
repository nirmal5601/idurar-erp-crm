import { useSelector } from 'react-redux';

import { ErpLayout } from '@/layout';

import NotFound from '@/components/NotFound';
import PageLoader from '@/components/PageLoader';

import { selectAISummaryItem } from '@/redux/erp/selectors';

import AISummaryItem from '@/modules/ErpPanelModule/AISummaryItem';

export default function AISummaryInvoiceModule({ config }) {

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
