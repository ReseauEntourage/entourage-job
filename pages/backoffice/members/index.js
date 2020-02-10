/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { UserContext } from '../../../components/store/UserProvider';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Section, GridNoSSR } from '../../../components/utils';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import axios from '../../../Axios';
import ModalEdit from '../../../components/modals/ModalEdit';
import schemaCreateUser from '../../../components/forms/schema/formCreateUser';

const MembersAdmin = () => {
  const Content = () => {
    const [members, setMembers] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    const fetchData = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.SERVER_URL}/api/v1/user/`
          );
          setMembers(data);
        } catch (err) {
          console.error(err);
          setHasError(true);
        } finally {
          setLoading(false);
        }
      } else console.log('no user');
    };

    useEffect(() => {
      fetchData();
    }, []);

    if (hasError) {
      return (
        <Section className="uk-width-1-1">
          <div className=" uk-text-center uk-flex uk-flex-center">
            <div className="uk-width-xlarge">
              <h2 className="uk-margin-remove">
                Les membres n&apos;ont pas pu etre chargés correctement.
              </h2>
              <p>
                Contacte{' '}
                <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>
        </Section>
      );
    }

    if (loading) {
      return (
        <div className="uk-height-medium uk-flex uk-flex-center uk-flex-middle">
          <div data-uk-spinner="" />
        </div>
      );
    }

    return (
      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
          <thead>
            <tr>
              <th className="uk-table-expand">Membre</th>
              <th className="uk-width-small">Role</th>
              <th className="uk-width-small">Coach</th>
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
                        alt=""
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
                  <td className="uk-text-truncate">{member.lastConnection}</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
        <ModalEdit
          id="add-user"
          formSchema={schemaCreateUser}
          title="Création de membre"
          description="Merci de renseigner quelques informations afin de créer le membre"
          submitText="Créer le membre"
          onSubmit={async (fields) => {
            const res = await axios.post('api/v1/user', fields);
            console.log(res);
            fetchData();
          }}
        />
      </div>
    );
  };

  return (
    <LayoutBackOffice title="Gestion des menmbres">
      <Section>
        <HeaderBackoffice
          title="Gestion des menmbres"
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
        <Content />
      </Section>
    </LayoutBackOffice>
  );
};
export default MembersAdmin;
