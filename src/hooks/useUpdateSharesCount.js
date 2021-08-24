import { useCallback, useContext } from 'react';
import { SharesCountContext } from 'src/components/store/SharesCountProvider';
import Api from 'src/Axios';

export function useUpdateSharesCount() {
  const { incrementSharesCount } = useContext(SharesCountContext);

  return useCallback(
    (candidatId, type) => {
      Api.post('api/v1/cv/count', {
        candidatId,
        type,
      })
        .then(() => {
          incrementSharesCount();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [incrementSharesCount]
  );
}
