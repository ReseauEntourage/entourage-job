/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaUsefulInformation from '../forms/schema/formEditUsefulInformation';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';
import { mutateFormSchema } from '../../utils';

const InfoProfileCard = ({
  contracts,
  locations,
  availability,
  languages,
  transport,
  email,
  phone,
  address,
  onChange,
}) => {
  const mutatedSchema = mutateFormSchema(schemaUsefulInformation, [
    {
      fieldId: 'email',
      props: [
        {
          propName: 'disabled',
          value: true,
        },
      ],
    },
  ]);

  return (
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
          <IconNoSSR name="mail" style={{ width: 20 }} />{' '}
          {email || 'Adresse mail non renseigné'}
        </li>
        <li>
          <IconNoSSR name="phone" style={{ width: 20 }} />{' '}
          {phone || 'Numéro de téléphone non renseigné'}
        </li>
        <li>
          <IconNoSSR name="home" style={{ width: 20 }} />{' '}
          {address || 'Adresse postale non renseignée'}
        </li>
        <li>
          <IconNoSSR name="file-text" style={{ width: 20 }} />{' '}
          {contracts && contracts.length > 0
            ? contracts.join(' / ')
            : 'Type de contrat recherché non renseigné'}
        </li>
        <li>
          <IconNoSSR name="location" style={{ width: 20 }} />{' '}
          {locations && locations.length > 0
            ? locations.join(' / ')
            : 'Localisations non renseignées'}
        </li>
        <li>
          <IconNoSSR name="calendar" style={{ width: 20 }} />{' '}
          {availability && availability !== ''
            ? availability
            : 'Disponibilités non renseignée'}
        </li>
        <li>
          <IconNoSSR name="users" style={{ width: 20 }} />{' '}
          {languages && languages.length > 0
            ? languages.join(' / ')
            : 'Langues apprises non renseignées'}
        </li>
        <li>
          <IconNoSSR name="car" style={{ width: 20 }} />{' '}
          {transport && transport !== ''
            ? transport
            : 'Moyen de transport non renseigné'}
        </li>
      </ul>
      {onChange && (
        <ModalEdit
          id="modal-usefulinformation"
          title="Édition - Informations utiles"
          formSchema={mutatedSchema}
          defaultValues={{
            locations,
            availability,
            transport,
            contracts,
            languages,
            email,
            phone,
            address,
          }}
          onSubmit={(fields, closeModal) => {
            closeModal();
            onChange({
              ...fields,
            });
          }}
        />
      )}
    </div>
  );
};

InfoProfileCard.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.string),
  availability: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  transport: PropTypes.string,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  address: PropTypes.string,
  onChange: PropTypes.func,
};

InfoProfileCard.defaultProps = {
  contracts: [],
  locations: [],
  availability: '',
  languages: [],
  transport: '',
  phone: '',
  address: '',
  onChange: null,
};

export default InfoProfileCard;
