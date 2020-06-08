/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaUsefulInformation from '../forms/schema/formEditUsefulInformation.json';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const InfoProfileCard = ({
  contracts,
  location,
  availability,
  languages,
  transport,
  onChange,
}) => (
  <div className="uk-card uk-card-primary uk-card-body">
    <GridNoSSR between gap="small" eachWidths={['expand', 'auto']}>
      <h3 className="uk-card-title">
        {!onChange && (
          <span className="uk-margin-small-right">
            <IconNoSSR name="info" />
          </span>
        )}
        Infos pratiques
      </h3>
      {onChange && (
        <ButtonIcon
          name="pencil"
          onClick={() => {
            UIkit.modal(`#modal-usefulinformation`).show();
          }}
        />
      )}
    </GridNoSSR>
    <ul className="uk-list">
      <li>
        <IconNoSSR name="file-text" />{' '}
        {contracts.length > 0
          ? contracts.join(' / ')
          : 'Type de contrat recherché non renseigné'}
      </li>
      <li>
        <IconNoSSR name="location" />{' '}
        {location && location !== '' ? location : 'Localisation non renseignée'}
      </li>
      <li>
        <IconNoSSR name="calendar" />{' '}
        {availability && availability !== ''
          ? availability
          : 'Disponibilités non renseignée'}
      </li>
      <li>
        <IconNoSSR name="users" />{' '}
        {languages.length > 0
          ? languages.join(' / ')
          : 'Langues apprises non renseignées'}
      </li>
      <li>
        <IconNoSSR name="hashtag" />{' '}
        {transport && transport !== ''
          ? transport
          : 'Moyen de transport non renseigné'}
      </li>
    </ul>
    {onChange && (
      <ModalEdit
        id="modal-usefulinformation"
        title="Édition - Informations utiles"
        formSchema={schemaUsefulInformation}
        defaultValues={{
          location,
          availability,
          transport,
          contracts,
          languages,
        }}
        onSubmit={(fields, closeModal) => {
          closeModal();
          onChange({
            ...fields,
          })
        }}
      />
    )}
  </div>
);
InfoProfileCard.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
  availability: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  transport: PropTypes.string,
  onChange: PropTypes.func,
};

InfoProfileCard.defaultProps = {
  contracts: [],
  location: '',
  availability: '',
  languages: [],
  transport: '',
  onChange: null,
};

export default InfoProfileCard;
