/* global UIkit */
import React, { useEffect, useState } from 'react';
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

const CVPage = ({ member }) => {
  const [candidatForCoach, setCandidatForCoach] = useState(null);
  useEffect(() => {
    if (member.userToCoach) {
      Api.get(
        `${process.env.SERVER_URL}/api/v1/user/${member.userToCoach}`
      ).then(({ data }) => {
        setCandidatForCoach(data);
      });
    }
  }, [member]);

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

  return (
    <LayoutBackOffice title={`${member.firstName} - Gestion des menmbres`}>
      <Section>
        <GridNoSSR column gap="large">
          <SimpleLink
            href="/backoffice/admin/membres"
            className="uk-link-reset"
          >
            <IconNoSSR name="chevron-left" />
            retour à la liste
          </SimpleLink>

          <div>
            <CandidatHeader
              member={member}
              candidatForCoach={candidatForCoach}
            />
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
          <CVPageContent member={member} />
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  try {
    const { data } = await Api.get(
      `${process.env.SERVER_URL}/api/v1/user/${query.id}`
    );
    return { member: data };
  } catch (error) {
    return { member: null };
  }
};
CVPage.propTypes = {
  member: PropTypes.shape().isRequired,
};
CVPage.defaultProps = {};

export default CVPage;
