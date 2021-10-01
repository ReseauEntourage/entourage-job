import moment from 'moment';
import React from 'react';
import { CONTRACTS } from 'src/constants';
import PropTypes from 'prop-types';

const ContractLabel = ({ contract, endOfContract }) => {
  if (contract) {
    return (
      <div className="uk-text-muted">
        {
          CONTRACTS.find((contractConst) => {
            return contractConst.value === contract;
          })?.label
        }
        {endOfContract
          ? ` - Jusqu'au ${moment(endOfContract).format('DD/MM/YYYY')}`
          : ''}
      </div>
    );
  }

  return null;
};

ContractLabel.propTypes = {
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
};

ContractLabel.defaultProps = {
  contract: undefined,
  endOfContract: undefined,
};

export default ContractLabel;
