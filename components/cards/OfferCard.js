import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {OFFER_STATUS, USER_ROLES} from "../../constants";
import {GridNoSSR, Button, IconNoSSR, SimpleLink} from '../utils';

function translateStatus(status) {
  const currentStatus = OFFER_STATUS.find((oStatus) => oStatus.value === status);
  if(currentStatus) return currentStatus.label;
  return "Non défini";
}

const OfferCard = ({
  title,
  from,
  shortDescription,
  isStared,
  isNew,
  archived,
  isPublic,
  date,
  userOpportunity,
  isValidated,
  isAdmin,
}) => (
  <div
    className={`ent-offer uk-card uk-card-hover uk-card-body uk-card-${
      archived ? 'secondary' : 'default'
    }`}
  >
    {isNew && <div className="ent-offer-badge" />}
    <GridNoSSR className="uk-height-max-large" gap="medium" childWidths={['1-1']}>
      <GridNoSSR eachWidths={['expand', 'auto']}>
        <h5 className="uk-text-bold">{title}</h5>
        {isStared === undefined ? (
          <></>
        ) : (
          <IconNoSSR
            name="star"
            className={`${isStared ? 'ent-color-amber' : undefined}`}
          />
        )}
      </GridNoSSR>
      <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
        <IconNoSSR name="user" />
        <p>{from}</p>
      </GridNoSSR>
      <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
        <IconNoSSR name="world" />
        <p>{shortDescription}</p>
      </GridNoSSR>
      <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
        <IconNoSSR name="info" />
        <div>
          {
            isPublic ?
              <p className="uk-margin-remove-bottom">Offre générale</p> :
              (
                userOpportunity &&
                userOpportunity.User &&
                userOpportunity.User.firstName &&
                isAdmin ?
                  (
                    <p className="uk-margin-remove-bottom">Offre pour {userOpportunity.User.firstName}</p>
                  ) :
                  <p className="uk-margin-remove-bottom">Offre personnelle</p>
              )
          }
          {
            userOpportunity &&
            userOpportunity.status !== undefined &&
            <span className="uk-text-meta uk-text-warning" style={{ color: '#666' }}>{translateStatus(userOpportunity.status)}</span>
          }
        </div>
      </GridNoSSR>
      {date && (
        <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="calendar" />
          <p>{moment(date).format('DD/MM/YYYY')}</p>
        </GridNoSSR>
      )}
      <div className="uk-flex uk-flex-between uk-flex-bottom uk-margin-small-top">
        {
          isAdmin &&
          <div className="uk-flex-1 uk-text-left uk-text-meta uk-text-success uk-flex uk-flex-bottom">
            {
              !archived && (
              isValidated ?
                <div className="uk-flex uk-flex-middle">Validé&nbsp;<IconNoSSR name="check"/></div> :
                <div className="uk-flex uk-flex-middle uk-text-danger">En attente</div>
              )
            }
          </div>
        }
        <u className="uk-link-muted uk-flex-1 uk-text-right">Voir l&rsquo;offre</u>
      </div>
    </GridNoSSR>
  </div>
);

OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  isStared: PropTypes.bool,
  isNew: PropTypes.bool,
  archived: PropTypes.bool,
  isPublic: PropTypes.bool,
  date: PropTypes.string,
  userOpportunity: PropTypes.shape(),
  isValidated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool,
};

OfferCard.defaultProps = {
  isStared: undefined,
  isNew: undefined,
  archived: undefined,
  isPublic: undefined,
  date: undefined,
  userOpportunity: undefined,
  isAdmin: false,
};
export default OfferCard;
