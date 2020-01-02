/* global UIkit */
import React from 'react';
import PropsType from 'prop-types';
import { GridNoSSR, Button, IconNoSSR } from '../utils';
import Textarea from '../forms/fields/Textarea';
import ButtonIcon from '../utils/ButtonIcon';

const OfferInfoContainer = ({ icon, title, items }) => (
  <GridNoSSR
    gap="small"
    eachWidths={['auto', 'expand']}
    items={[
      <IconNoSSR name={icon} />,
      <GridNoSSR
        gap="collapse"
        childWidths={['1-1']}
        items={[<span className="uk-text-bold">{title}</span>, ...items]}
      />,
    ]}
  />
);
OfferInfoContainer.propsType = {
  icon: PropsType.string.isRequired,
  title: PropsType.string.isRequired,
  items: PropsType.arrayOf(PropsType.string),
};
OfferInfoContainer.defaultProps = {
  items: [],
};

const ModalOffer = ({ currentOffer, setCurrentOffer }) => (
  <div id="modal-offer" data-uk-modal="bg-close:false">
    <div className="uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl">
      <div className="uk-modal-body">
        <GridNoSSR
          gap="small"
          between
          items={[
            <h3 className="uk-text-bold">{currentOffer.title}</h3>,
            <ul className="uk-iconnav uk-grid-medium">
              <li>
                <ButtonIcon name="trash" />
              </li>
              <li>
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
              </li>
              <li>
                <ButtonIcon
                  name="close"
                  onClick={() => {
                    setCurrentOffer({});
                    UIkit.modal('#modal-offer').hide();
                  }}
                />
              </li>
            </ul>,
          ]}
        />
        <hr />
        <GridNoSSR
          className="uk-margin-bottom"
          eachWidths={['1-3@s', '2-3@s']}
          items={[
            <GridNoSSR
              gap="medium"
              items={[
                <Button className="uk-margin-large-left" disabled>
                  <span style={{ color: '#666' }}>
                    {currentOffer.businessLine}
                  </span>
                </Button>,
                <OfferInfoContainer
                  icon="hashtag"
                  title="Entreprise"
                  items={[currentOffer.company]}
                />,
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
                />,
                <OfferInfoContainer
                  icon="location"
                  title={currentOffer.location}
                />,
              ]}
            />,
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
ModalOffer.propsType = {
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
