import React from 'react';
import PropTypes from 'prop-types';
import LayoutBackOffice from '../../../../components/backoffice/LayoutBackOffice';
import Api from '../../../../Axios';
import {
  Section,
  SimpleLink,
  GridNoSSR,
  IconNoSSR,
} from '../../../../components/utils';
import CVPageContent from '../../../../components/backoffice/cv/CVPageContent';
import CandidatHeader from '../../../../components/backoffice/cv/CandidatHeader';

const CVPage = ({ user }) => {
  if (!user) {
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
  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des menmbres`}>
      <Section>
        <GridNoSSR column gap="large">
          <SimpleLink
            href={`/backoffice/admin/membres?role=${user.role}`}
            className="uk-link-reset"
          >
            <IconNoSSR name="chevron-left" />
            retour à la liste
          </SimpleLink>
          <div>
            <CandidatHeader user={user} />
            <hr className="ent-divier-backoffice uk-margin-large-top " />
          </div>
          <GridNoSSR eachWidths={['expand', 'auto']}>
            <ul className="uk-subnav" data-uk-switcher>
              <li className="uk-active">
                <a href="#" onClick={() => {}}>
                  CV
                </a>
              </li>
              <li>
                <a href="#" onClick={() => {}}>
                  Opportunités
                </a>
              </li>
              <li>
                <a href="#" onClick={() => {}}>
                  Paramètres
                </a>
              </li>
            </ul>
            <div />
          </GridNoSSR>
          {user.role === 'Coach' &&
            (user.coach ? (
              <CVPageContent candidatId={user.coach.candidat.id} />
            ) : (
              <>
                <h2 className="uk-text-bold">
                  <span className="uk-text-primary">Aucun candidat</span>{' '}
                  n&apos;est rattaché à ce compte coach.
                </h2>
                <p>
                  Il peut y avoir plusieurs raisons à ce sujet. Contacte
                  l&apos;équipe LinkedOut pour en savoir plus.
                </p>
              </>
            ))}
          {user.role === 'Candidat' && <CVPageContent candidatId={user.id} />}
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  try {
    const { data } = await Api.get(`/api/v1/user/${query.id}`);
    return { user: data };
  } catch (error) {
    return { user: null };
  }
};
CVPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    urlImg: PropTypes.string,
    role: PropTypes.string,
    candidat: PropTypes.shape({
      url: PropTypes.string,
      coach: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    coach: PropTypes.shape({
      url: PropTypes.string,
      candidat: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }).isRequired,
};
CVPage.defaultProps = {};

export default CVPage;
