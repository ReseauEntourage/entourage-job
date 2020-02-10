import React from 'react';
import PropTypes from 'prop-types';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import { Section } from '../../../components/utils';

const CVPage = ({ member }) => {
  if (!member) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des menmbres">
        <Section className="uk-text-center" size="large">
          <h2>Ce profil n’est pas disponible</h2>
          <p>
            Le lien que vous avez suivi est peut-être rompu, ou la page a été
            supprimée.
          </p>
        </Section>
      </LayoutBackOffice>
    );
  }

  const name =
    member.firstName.charAt(0).toUpperCase() +
    member.firstName.slice(1).toLowerCase();
  return (
    <LayoutBackOffice title="Gestion des menmbres">
      <Section>{name}</Section>
    </LayoutBackOffice>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  const res = await Api.get(
    `${process.env.SERVER_URL}/api/v1/user/${query.id}`
  );
  return { member: res.data };
};
CVPage.propTypes = {
  member: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    asPath: PropTypes.string.isRequired,
  }),
};
CVPage.defaultProps = {
  member: null,
  router: {
    asPath: '',
  },
};

export default CVPage;
