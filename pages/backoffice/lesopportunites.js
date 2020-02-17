/* global UIkit */
import React, { useState, useEffect } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalOffer from '../../components/modals/ModalOffer';
import Filter from '../../components/utils/Filter';
import Axios from '../../Axios';

const Opportunites = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const filters = [
    { tag: 'all', title: 'Toutes les offres' },
    { tag: 'pending', title: 'Offres en attente' },
    { tag: 'validated', title: 'Offres validées' },
    { tag: 'archived', title: 'Offres archivées' },
  ];

  const getTag = (offer) => {
    const tag = ['all'];
    if (offer.isArchived) {
      tag.push('archived');
    } else if (offer.isValidated) {
      tag.push('validated');
    } else {
      tag.push('pending');
    }
    return tag.map((t) => `tag-${t}`).join(' ');
  };

  const onClickOpportunityCard = async (offer) => {
    setCurrentOffer(offer);
    UIkit.modal('#modal-offer').show();
  };

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const { data } = await Axios.get(
        `${process.env.SERVER_URL}/api/v1/opportunity/admin`,
        {
          params: {
            query,
          },
        }
      );
      setOffers(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LayoutBackOffice title="Gestion des offres d'emploi">
      <Section>
        <HeaderBackoffice
          title="Gestion des offres d'emploi"
          description="Ici tu peux accéder à toutes les opportunités et valider les offres qui se retrouveront ensuite dans les tableaux des candidats."
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
              console.log('#add-opportunity');
              // UIkit.modal('#add-opportunity').show();
            }}
          >
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouvelle opportunité
          </button>
          {/* <ModalEdit

          id="add-opportunity"
          // formSchema={schemaCreateUser}
          title="Création d'offre"
          description="Merci de renseigner quelques informations afin de créer le membre"
          submitText="Créer l'offre"
          onSubmit={async (fields) => {
            // try {
            //   const { data } = await Axios.post('api/v1/user', fields);
            //   if (data) {
            //     UIkit.notification('Le membre a bien été créé', 'success');
            //     setMembers(
            //       [...members, data].sort((a, b) => {
            //         if (a.firstName > b.firstName) {
            //           return 1;
            //         }
            //         if (b.firstName > a.firstName) {
            //           return -1;
            //         }
            //         return 0;
            //       })
            //     );
            //   } else {
            //     throw new Error('réponse de la requete vide');
            //   }
            // } catch (error) {
            //   console.error(error);
            //   UIkit.notification(
            //     "Une erreur c'est produite lors de la création du membre",
            //     'danger'
            //   );
            // }
          }}
        /> */}
        </HeaderBackoffice>
        {hasError ? (
          <Section className="uk-width-1-1">
            <div className=" uk-text-center uk-flex uk-flex-center">
              <div className="uk-width-xlarge">
                <h2 className="uk-margin-remove">
                  Les opportunités n&apos;ont pas pu etre chargés correctement.
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
          <>
            <Filter
              id="opportunitees"
              loading={loading}
              filters={filters}
              search={({ target: { value } }) => {
                fetchData(value);
              }}
            >
              {offers &&
                offers.map((offer, i) => {
                  return (
                    <li key={i} className={getTag(offer)}>
                      <a
                        aria-hidden
                        role="button"
                        className="uk-link-reset"
                        onClick={() => onClickOpportunityCard(offer)}
                      >
                        <OfferCard
                          title={offer.title}
                          from={offer.recruiterName}
                          shortDescription={offer.company}
                          archived={offer.isArchived}
                        />
                      </a>
                    </li>
                  );
                })}
            </Filter>
            <ModalOffer
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer(offer);
              }}
            />
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
