/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import {
  Section,
  SimpleLink,
  GridNoSSR,
  IconNoSSR,
  Button,
} from '../../../components/utils';
import { CVFicheEdition } from '../../../components/cv';

function translate(status) {
  switch (status) {
    case 'Pending':
      return 'En attente';
    case 'Published':
      return 'Publié';
    case 'New':
      return 'Nouveau';
    case 'Draft':
      return 'Brouillon';
    default:
      return status;
  }
}
const Content = ({ userId, user }) => {
  const [cv, setCV] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEdit = async () => {
      try {
        const { data } = await Api.get(`${process.env.SERVER_URL}/api/v1/cv/`, {
          params: {
            userId: user.role === 'Coach' ? user.userToCoach : userId,
          },
        });
        if (data) {
          setCV(data);
        } else {
          setCV(null);
        }
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue durant le chargement du CV.');
      }
    };
    fetchEdit();
  }, [userId]);

  const publishCV = async () => {
    setLoading(true);
    try {
      // put
      const formData = new FormData();
      const obj = {
        ...cv,
        status: 'Published',
        version: cv.version + 1,
        profileImage: undefined,
      };
      delete obj.id;
      formData.append('cv', JSON.stringify(obj));
      formData.append('profileImage', cv.profileImage);
      const { data } = await Api.post(
        `${process.env.SERVER_URL}/api/v1/cv`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(data);
      setCV(data);
      UIkit.notification('Le profil a été mis à jour', {
        pos: 'bottom-center',
        status: 'info',
      });
    } catch (err) {
      console.error(err);
      UIkit.notification("Une erreur s'est produite", {
        pos: 'bottom-center',
        status: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  // aucun CV
  if (cv === null) {
    if (user) {
      if (user.role === 'Candidat') {
        return (
          <GridNoSSR column middle>
            <h2 className="uk-text-bold">
              <span className="uk-text-primary">Aucun CV</span> n&apos;est
              rattaché à ce compte candidat.
            </h2>
            <Button
              style="primary"
              onClick={() =>
                Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                  cv: { userId },
                }).then(({ data }) => setCV(data))
              }
            >
              Creer votre CV
            </Button>
          </GridNoSSR>
        );
      }
      if (user.role === 'Coach') {
        return (
          <GridNoSSR column middle>
            <h2 className="uk-text-bold">
              <span className="uk-text-primary">Aucun candidat</span> n&apos;est
              rattaché à ce compte coach.
            </h2>
            <p>
              Il peut y avoir plusieurs raisons à ce sujet. Contacte
              l&apos;équipe LinkedOut pour en savoir plus.
            </p>
            {user.userToCoach && (
              <Button
                style="primary"
                onClick={() =>
                  Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                    cv: {
                      userId: user.userToCoach,
                    },
                  }).then(({ data }) => setCV(data))
                }
              >
                Creer votre CV
              </Button>
            )}
          </GridNoSSR>
        );
      }
    }
  }
  // erreur pendant la requete
  if (error) {
    return (
      <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
        <div
          className="uk-position-absolute uk-transform-center uk-text-center"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="ukuk-width-xlarge">
            <h2 className="uk-text-bold uk-margin-remove">{error}</h2>
            <p>
              Contacte{' '}
              <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
              pour en savoir plus.
            </p>
          </div>
        </div>
      </div>
    );
  }
  // chargement
  if (cv === undefined) {
    return (
      <div className="uk-height-small uk-flex uk-flex-middle uk-flex-center">
        <div data-uk-spinner />
      </div>
    );
  }
  // affichage du CV
  return (
    <>
      <GridNoSSR between middle>
        <GridNoSSR column gap="collapse">
          <div>
            Statut :{' '}
            <span
              className={`uk-text-${(() => {
                switch (cv.status) {
                  case 'Draft':
                    return 'warning';
                  case 'Published':
                    return 'success';
                  case 'New':
                    return 'info';
                  default:
                    return 'muted';
                }
              })()}`}
            >
              {translate(cv.status)}
            </span>
          </div>
          <div>Version : {cv.version}</div>
        </GridNoSSR>
        <Button
          style="primary"
          onClick={() => {
            if (!loading) publishCV();
          }}
        >
          <div className="uk-flex uk-flex-middle">
            Publier
            {loading ? (
              <div
                className="uk-margin-small-left"
                data-uk-spinner="ratio: .5"
              />
            ) : null}
          </div>
        </Button>
      </GridNoSSR>
      <CVFicheEdition
        cv={cv}
        onChange={(fields) => {
          setCV({ ...cv, ...fields, status: 'Draft' });
        }}
      />
    </>
  );
};
Content.propTypes = {
  userId: PropTypes.string,
  user: PropTypes.shape,
};

Content.defaultProps = {
  userId: null,
  user: null,
};

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

  return (
    <LayoutBackOffice title={`${member.firstName} - Gestion des menmbres`}>
      <Section>
        <GridNoSSR column gap="large">
          <SimpleLink href="/backoffice/members" className="uk-link-reset">
            <IconNoSSR name="chevron-left" />
            retour à la liste
          </SimpleLink>

          <div>
            <GridNoSSR row gap="small" middle>
              <img
                className="uk-preserve-width uk-border-circle"
                src={member.urlImg || '/static/img/arthur.png'}
                width="48"
                style={{ height: '48px' }}
                alt={`${member.firsName} profil`}
              />
              <GridNoSSR column gap="collapse">
                <h3 className="uk-text-bold">
                  {member.firstName} {member.lastName}
                </h3>
                <span>{member.role}</span>
                {member.role === 'Candidat' && (
                  <SimpleLink
                    className="uk-link-text"
                    target="_blank"
                    href={`${process.env.SERVER_URL}/cv/${member.url}`}
                  >
                    <IconNoSSR name="link" />
                    <span>
                      {process.env.SERVER_URL}/cv/{member.url}
                    </span>
                  </SimpleLink>
                )}
              </GridNoSSR>
            </GridNoSSR>
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
          {member.role !== 'Admin' && (
            <Content userId={member.id} user={member} />
          )}
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  const { data } = await Api.get(
    `${process.env.SERVER_URL}/api/v1/user/${query.id}`
  );
  return { member: data };
};
CVPage.propTypes = {
  member: PropTypes.shape().isRequired,
};
CVPage.defaultProps = {};

export default CVPage;
