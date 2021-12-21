import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaUsefulInformation from 'src/components/forms/schema/formEditUsefulInformation';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import { getAllFilters, mutateFormSchema } from 'src/utils';

import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { openModal } from 'src/components/modals/Modal';

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
  userZone,
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
    {
      fieldId: 'locations',
      props: [
        {
          propName: 'options',
          value: getAllFilters(DEPARTMENTS_FILTERS, userZone),
        },
      ],
    },
  ]);

  return (
    <div className="uk-card uk-card-primary uk-card-body">
      <Grid between gap="small" eachWidths={['expand', 'auto']}>
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
              openModal(
                <ModalEdit
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
              );
            }}
          />
        )}
      </Grid>
      <Grid column gap="small">
        <Grid row gap="small" middle>
          <IconNoSSR name="mail" style={{ width: 20 }} />
          {email || 'Adresse mail non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="phone" style={{ width: 20 }} />
          {phone || 'Numéro de téléphone non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="home" style={{ width: 20 }} />
          {address || 'Adresse postale non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="file-text" style={{ width: 20 }} />
          {contracts && contracts.length > 0
            ? contracts.join(' / ')
            : 'Type de contrat recherché non renseigné'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="location" style={{ width: 20 }} />
          {locations && locations.length > 0
            ? locations.join(' / ')
            : 'Localisations non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="calendar" style={{ width: 20 }} />
          {availability && availability !== ''
            ? availability
            : 'Disponibilités non renseignée'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="users" style={{ width: 20 }} />
          {languages && languages.length > 0
            ? languages.join(' / ')
            : 'Langues apprises non renseignées'}
        </Grid>
        <Grid row gap="small" middle>
          <IconNoSSR name="car" style={{ width: 20 }} />
          {transport && transport !== ''
            ? transport
            : 'Moyen de transport non renseigné'}
        </Grid>
      </Grid>
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
  userZone: PropTypes.string,
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
  userZone: undefined,
};

export default InfoProfileCard;
