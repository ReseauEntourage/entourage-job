/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Button, Section } from '../../../components/utils';
import OfferCard from '../../../components/cards/OfferCard';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import ModalOfferAdmin from '../../../components/modals/ModalOfferAdmin';
import Filter from '../../../components/utils/Filter';
import Axios from '../../../Axios';
import schema from '../../../components/forms/schema/formEditOpportunity';
import { UserContext } from '../../../components/store/UserProvider';
import ModalEdit from '../../../components/modals/ModalEdit';
import { mutateFormSchema } from "../../../utils";
import { ModalContext } from '../../../components/store/ModalProvider';

const LesOpportunites = () => {
  const { user } = useContext(UserContext);
  const { triggerModal, setClose, close, id } = useContext(ModalContext);
  const {
    query: { q: opportunityId },
  } = useRouter();

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  // desactivation du champ de disclaimer
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'disclaimer',
      props: [
        {
          propName: 'hidden',
          value: true
        }
      ]
    }
  ]);

  const filters = [
    { tag: 'all', title: 'Toutes les offres' },
    { tag: 'pending', title: 'Offres à valider', active: true },
    { tag: 'validated', title: 'Offres publiées' },
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

  const fetchData = async (query) => {
    if (user) {
      try {
        setLoading(true);
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
        return data;
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    }
    return null;
  };

  const postOpportunity = async (opportunity, closeModal) => {
    console.log('post opportunity', closeModal);
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
      closeModal();
      UIkit.notification(`L'opportunité a été ajoutée.`, 'success');
      fetchData();
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        const offer = data.find((o) => o.id === opportunityId);
        if (offer) {
          setCurrentOffer(offer);
          triggerModal('#modal-offer-admin');
        }
      }
    });
  }, [user, opportunityId]);

  if (!user) return null;

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        <HeaderBackoffice
          title="Modération des offres d'emploi"
          description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
        >
          <Button
            style="primary"
            onClick={() => triggerModal("#add-opportunity")}>
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouvelle opportunité
          </Button>
          <ModalEdit
            id="add-opportunity"
            title="Ajouter une opportunité"
            submitText="Envoyer"
            formSchema={mutatedSchema}
            defaultValues={{
              isPublic: true
            }}
            onSubmit={(fields) => {
              postOpportunity({
                ...fields,
                date: Date.now(),
              }, () => setClose(true))
            }}
          />
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
                          onClick={() => {
                            console.log('Clicked on offer', 'close :>>', close, 'id :>>', id);
                            setCurrentOffer(offer);
                            triggerModal('#modal-offer-admin');
                          }}
                        >
                          <OfferCard
                            title={offer.title}
                            from={offer.recruiterName}
                            shortDescription={offer.company}
                            date={offer.date}
                            archived={offer.isArchived}
                            isPublic={offer.isPublic}
                            specifiedOffer={
                              !offer.isPublic &&
                              offer.userOpportunity &&
                              offer.userOpportunity[0] &&
                              offer.userOpportunity[0].User &&
                              offer.userOpportunity[0].User.firstName
                            }
                            customBadge={(() => {
                              let className = ' uk-label-warning';
                              let content = 'En attente';
                              if (offer.isValidated) {
                                content = 'Validé';
                                className = ' uk-label-success';
                              }
                              if (offer.isArchived) {
                                content = 'Archivé';
                                className = ' uk-label-danger';
                              }
                              return (
                                <div
                                  className={`uk-card-badge uk-label${className}`}
                                >
                                  {content}
                                </div>
                              );
                            })()}
                          />
                        </a>
                      </li>
                    );
                  })}
              </Filter>
              <div>
                <ModalOfferAdmin
                  id="modal-offer-admin"
                  currentOffer={currentOffer}
                  setCurrentOffer={(offer) => {
                    setCurrentOffer(offer);
                    fetchData();
                  }}
                />
              </div>
            </>
          )}
      </Section>
    </LayoutBackOffice>
  );
};
export default LesOpportunites;
