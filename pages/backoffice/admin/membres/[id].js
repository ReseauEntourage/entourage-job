import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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
import UserInformationCard from '../../../../components/cards/UserInformationCard';

const CVPage = () => {
  const [onglet, setOnglet] = useState('cv');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    query: { id },
  } = useRouter();

  useEffect(() => {
    setLoading(true);
    Api.get(`/api/v1/user/${id}`).then(({ data }) => {
      setUser(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des menmbres">
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
              <div uk-spinner />
              <hr className="ent-divier-backoffice uk-margin-large-top " />
            </div>
          </GridNoSSR>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des menmbres">
        <Section className="uk-text-center" size="large">
          <GridNoSSR column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset"
            >
              <IconNoSSR name="chevron-left" />
              retour à la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice uk-margin-large-top " />
              <h2>Ce profil n’est pas disponible</h2>
              <p>
                Le lien que vous avez suivi est peut-être rompu, ou la page a
                été supprimée.
              </p>
            </div>
          </GridNoSSR>
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
          <ul className="uk-subnav">
            <li className={onglet === 'cv' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('cv');
                }}
              >
                CV
              </a>
            </li>
            <li className={onglet === 'opportunity' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('opportunity');
                }}
              >
                Opportunités
              </a>
            </li>
            <li className={onglet === 'settings' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('settings');
                }}
              >
                Paramètres
              </a>
            </li>
          </ul>
          {onglet === 'cv' && (
            <>
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
              {user.role === 'Candidat' && (
                <CVPageContent candidatId={user.id} />
              )}
            </>
          )}
          {onglet === 'settings' && (
            <GridNoSSR childWidths={['1-2@m']}>
              {(user.role === 'Candidat' || user.role === 'Coach') && (
                <UserInformationCard
                  user={user}
                  onChange={(data) => {
                    setUser(data);
                  }}
                />
              )}
            </GridNoSSR>
          )}
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
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
