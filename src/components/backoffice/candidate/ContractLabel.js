import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { findContractType } from 'src/utils';

const ContractLabel = ({ contract, endOfContract }) => {
  if (contract) {
    return (
      <div className="uk-text-muted">
        {findContractType(contract)?.label}
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
