/* global UIkit */
import React from 'react';
import PropsType from 'prop-types';
import { GridNoSSR, Button, IconNoSSR } from '../utils';
import Textarea from '../forms/fields/Textarea';
import Select from '../forms/fields/Select';
import ButtonIcon from '../utils/ButtonIcon';
import { CloseButtonNoSSR } from '../utils/CloseButton';

const List = ({ className, children }) => (
  <ul className={`uk-nav ${className}`}>
    {children.map((item) => (
      <li>{item}</li>
    ))}
  </ul>
);
List.propTypes = {
  className: PropsType.string,
  children: PropsType.arrayOf(PropsType.element).isRequired,
};
List.defaultProps = {
  className: undefined,
};

const OfferInfoContainer = ({ icon, title, items }) => (
  <GridNoSSR gap="small" eachWidths={['auto', 'expand']}>
    {icon ? <IconNoSSR name={icon} /> : <div className="uk-margin-left" />}
    <GridNoSSR gap="collapse" childWidths={['1-1']}>
      {title ? <span className="uk-text-bold">{title}</span> : undefined}
      {items}
    </GridNoSSR>
  </GridNoSSR>
);
OfferInfoContainer.propTypes = {
  icon: PropsType.string,
  title: PropsType.string.isRequired,
  items: PropsType.arrayOf(PropsType.string),
};
OfferInfoContainer.defaultProps = {
  icon: undefined,
  items: [],
};

const ModalOffer = ({ currentOffer, setCurrentOffer }) => (
  <div id="modal-offer" data-uk-modal="bg-close:false">
    <div className="uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl">
      <CloseButtonNoSSR className="uk-modal-close-default" />
      <div className="uk-modal-body">
        <GridNoSSR gap="small" between middle>
          <GridNoSSR middle>
            <h3 className="uk-text-bold">{currentOffer.title}</h3>
            <Select
              id="offer-status"
              title="Status"
              name="status"
              placeholder="status"
              options={[
                { value: 'contacté', text: 'Contacté' },
                { value: "phase d'entretien", text: "Phase d'entretien" },
                { value: 'embauche', text: 'Embauche' },
                { value: 'refus', text: 'Refus' },
                { value: 'standby', text: 'Standby' },
                { value: 'relance', text: 'Relance' },
              ]}
            />
          </GridNoSSR>
          <List className="uk-iconnav uk-grid-medium">
            <ButtonIcon name="pull" />
            <ButtonIcon
              name="star"
              className={
                currentOffer.isBookmark ? 'ent-color-amber' : undefined
              }
              onClick={() => {
                setCurrentOffer({
                  ...currentOffer,
                  isBookmark: !currentOffer.isBookmark,
                });
              }}
            />
          </List>
        </GridNoSSR>
        <hr />
        <GridNoSSR
          className="uk-margin-bottom"
          eachWidths={['1-3@s', '2-3@s']}
          items={[
            <GridNoSSR gap="medium">
              <OfferInfoContainer
                items={[
                  <Button disabled>
                    <span style={{ color: '#666' }}>
                      {currentOffer.businessLine}
                    </span>
                  </Button>,
                ]}
              />
              <OfferInfoContainer
                icon="hashtag"
                title="Entreprise"
                items={[currentOffer.company]}
              />
              <OfferInfoContainer
                icon="user"
                title="Recruteur"
                items={[
                  currentOffer.recruiterName,
                  currentOffer.recruiterEmail,
                  currentOffer.recruiterPhone,
                  <span className="uk-text-italic">
                    offre soumise le {currentOffer.date}
                  </span>,
                ]}
              />
              <OfferInfoContainer
                icon="location"
                title={currentOffer.location}
              />
            </GridNoSSR>,
            <OfferInfoContainer
              icon="comment"
              title="Message"
              items={[currentOffer.description]}
            />,
          ]}
        />
        <Textarea
          id="modal-offer-comment"
          name="modal-offer-comment"
          title="Ecrivez un commentaire à propos de cette opportunité..."
          type="text"
        />
      </div>
    </div>
  </div>
);
ModalOffer.propTypes = {
  currentOffer: PropsType.shape({
    description: PropsType.string,
    recruiterName: PropsType.string,
    recruiterEmail: PropsType.string,
    recruiterPhone: PropsType.string,
    location: PropsType.string,
  }).isRequired,
  setCurrentOffer: PropsType.func.isRequired,
};

export default ModalOffer;
