import React, { useContext } from 'react';
import { SharesCountContext } from '../components/store/SharesCountProvider';
import Api from '../Axios';

export function useUpdateSharesCount() {
  const { incrementSharesCount } = useContext(SharesCountContext);

  return (candidatId, type) => {
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
  };
}
