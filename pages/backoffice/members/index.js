/* global UIkit */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Section, GridNoSSR } from '../../../components/utils';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import axios from '../../../Axios';
import ModalEdit from '../../../components/modals/ModalEdit';
import schemaCreateUser from '../../../components/forms/schema/formCreateUser';

const MembersAdmin = () => {
  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 15;

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/api/v1/user/`,
        { params: { limit: LIMIT, offset } }
      );

      if (data.length < LIMIT) {
        setAllLoaded(true);
      }
      setOffset(offset + LIMIT);
      setMembers([...members, ...data]);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section>
        <HeaderBackoffice
          title="Gestion des membres"
          description="Ici tu peux à toutes les opportunités et valider les offres qui se retrouveront ensuite dans les tableaux des candidats."
        >
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
            onClick={() => {
              UIkit.modal('#add-user').show();
            }}
          >
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouveau membre
          </button>
        </HeaderBackoffice>
        {hasError ? (
          <Section className="uk-width-1-1">
            <div className=" uk-text-center uk-flex uk-flex-center">
              <div className="uk-width-xlarge">
                <h2 className="uk-margin-remove">
                  Les membres n&apos;ont pas pu etre chargés correctement.
                </h2>
                <p>
                  Contacte{' '}
                  <span className="uk-text-primary">
                    l&apos;équipe LinkedOut
                  </span>{' '}
                  pour en savoir plus.
                </p>
              </div>
            </div>
          </Section>
        ) : (
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
              <thead>
                <tr>
                  <th className="uk-table-expand">Membre</th>
                  <th className="uk-width-small">Role</th>
                  <th className="uk-width-small uk-text-nowrap">
                    Coach/Candidat associé
                  </th>
                  <th className="uk-table-shrink uk-text-nowrap">
                    Dernière connexion
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <Link href={`/backoffice/members/${member.id}`}>
                    <tr
                      className="uk-text-reset"
                      onClick={() => console.log('Zulfuye')}
                      aria-hidden="true"
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <GridNoSSR row gap="small" middle>
                          <img
                            className="uk-preserve-width uk-border-circle"
                            src="/static/img/arthur.png"
                            width="48"
                            style={{ height: '48px' }}
                            alt={`${member.firsName} profil`}
                          />
                          <GridNoSSR column gap="collapse">
                            <span className="uk-text-bold">
                              {member.firstName} {member.lastName}
                            </span>
                            <span>{member.email}</span>
                          </GridNoSSR>
                        </GridNoSSR>
                      </td>
                      <td className="uk-table-link">{member.role}</td>
                      <td className="">{member.userToCoach}</td>
                      <td className="uk-text-truncate">
                        {member.lastConnection}
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
            {!allLoaded && !loading && (
              <div className="uk-width-1-1 uk-flex uk-flex-center uk-flex-middle">
                <hr />
                <a
                  className="uk-link-text"
                  href="#"
                  type="button"
                  onClick={() => fetchData()}
                >
                  Voir plus...
                </a>
              </div>
            )}
            {loading && (
              <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
                <div data-uk-spinner="" />
              </div>
            )}
            <ModalEdit
              id="add-user"
              formSchema={schemaCreateUser}
              title="Création de membre"
              description="Merci de renseigner quelques informations afin de créer le membre"
              submitText="Créer le membre"
              onSubmit={async (fields) => {
                try {
                  const { data } = await axios.post('api/v1/user', fields);
                  if (data) {
                    UIkit.notification('Le membre a bien été créé', 'success');
                    setMembers(
                      [...members, data].sort((a, b) => {
                        if (a.firstName > b.firstName) {
                          return 1;
                        }
                        if (b.firstName > a.firstName) {
                          return -1;
                        }
                        return 0;
                      })
                    );
                  } else {
                    throw new Error('réponse de la requete vide');
                  }
                } catch (error) {
                  console.error(error);
                  UIkit.notification(
                    "Une erreur c'est produite lors de la création du membre",
                    'danger'
                  );
                }
              }}
            />
          </div>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default MembersAdmin;
