import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';
import { useCopyToClipboard } from 'src/hooks';

function translateCategory(isPublic) {
  if (!isPublic) return 'Offre privée';
  if (isPublic) return 'Offre générale';
  return 'Offre inconnue';
}

const ModalOfferInfo = ({
  offerId,
  title,
  isPublic,
  contract,
  startOfContract,
  endOfContract,
  numberOfPositions,
  isPartTime,
  date,
}) => {
  const { copyToClipboard, hasBeenCopied, setHasBeenCopied, fade } =
    useCopyToClipboard();

  return (
    <div className="uk-flex uk-flex-column">
      <div className="uk-flex uk-flex-middle">
        <h3 className="uk-text-bold uk-margin-remove-bottom">{title}</h3>
        <div style={{ width: 30 }}>
          <ButtonIcon
            className="uk-margin-small-left"
            ratio={0.8}
            tooltip="Copier le lien"
            name="link"
            onMouseLeave={() => {
              return setHasBeenCopied(false);
            }}
            onClick={() => {
              copyToClipboard(
                `${process.env.SERVER_URL}/backoffice/candidat/offres/${offerId}`
              );
            }}
          />
        </div>
        {hasBeenCopied && (
          <span
            className={`uk-text-meta uk-text-italic uk-margin-small-left ${
              fade ? 'uk-animation-fade uk-animation-reverse' : ''
            }`}
          >
            Lien copié&nbsp;!
          </span>
        )}
      </div>
      <span>{translateCategory(isPublic)}</span>
      <ContractLabel
        contract={contract}
        endOfContract={endOfContract}
        startOfContract={startOfContract}
      />
      <span className="uk-text-small">
        {numberOfPositions} poste
        {numberOfPositions > 1 ? 's' : ''} -{' '}
        {isPartTime ? 'Temps partiel' : 'Temps plein'}
      </span>
      <span className="uk-text-italic uk-text-small">
        offre soumise le {moment(date).format('DD/MM/YYYY')}
      </span>
    </div>
  );
};

ModalOfferInfo.propTypes = {
  offerId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  isPartTime: PropTypes.bool.isRequired,
  numberOfPositions: PropTypes.number.isRequired,
};

ModalOfferInfo.defaultProps = {
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
};

export default ModalOfferInfo;
