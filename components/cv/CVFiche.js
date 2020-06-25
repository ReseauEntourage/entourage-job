/* eslint-disable jsx-a11y/aria-role */
/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { Section, ImgNoSSR } from '../utils';
import { GridNoSSR } from '../utils/Grid';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schema from '../forms/schema/formEditOpportunity';
import Axios from '../../Axios';
import ModalShareCV from '../modals/ModalShareCV';
import Button from "../utils/Button";

/**
 * Le cv en public et en preview
 */
const CVFiche = ({ cv, actionDisabled }) => {
  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const hashtags = ['LinkedOut'];
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
  const title = `${cv.user.candidat.firstName} - LinkedOut`;

  // desactivation des champs candidat et publique
  schema.fields[
    schema.fields.findIndex((field) => field.id === 'candidatId')
  ].disable = () => true;

  schema.fields[
    schema.fields.findIndex((field) => field.id === 'isPublic')
  ].disabled = true;

  const postOpportunity = async (opportunity, closeModal) => {
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
      closeModal();
      UIkit.notification(
        `Merci pour votre message, ${cv.user.candidat.firstName} et son coach reviennent vers vous bientôt.`,
        'success'
      );
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };
  const openNewsletterModal = () =>
    UIkit.modal(`#info-share-${cv.user.candidat.firstName}`).show();

  return (
    <div id="cv-fiche" className="uk-container uk-position-relative">
      <div className="uk-card uk-card-default uk-card-body uk-card-large uk-margin-medium ">
        <GridNoSSR childWidths={['1-1']}>
          <div className="uk-text-center">
            <h1 className="uk-text-bold uk-heading-medium uk-text-primary">
              {cv.user.candidat.firstName} {cv.user.candidat.lastName}
            </h1>
            {cv.catchphrase && (
              <div
                className="uk-width-xlarge uk-margin-auto"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <p
                  className="uk-position-relative"
                  style={{
                    width: 'fit-content',
                    marginBottom: '8px',
                  }}
                >
                  <IconNoSSR
                    className="uk-text-primary ent-quote-after"
                    name="quote-right"
                    ratio={1.4}
                    flip
                  />
                  {cv.catchphrase}
                  <IconNoSSR
                    className="uk-text-primary ent-quote-before"
                    name="quote-right"
                    ratio={0.8}
                  />
                </p>
              </div>
            )}
            {/* uk-text-emphasis uk-text-bold */}
            <p className="uk-width-xxlarge uk-margin-auto uk-text-lead">
              J&apos;aimerais beaucoup travailler dans{' '}
              <span
                className="uk-label uk-text-lowercase"
                style={{
                  lineHeight: 'unset',
                  verticalAlign: 'bottom',
                  fontSize: 'inherit',
                }}
              >
                {cv.ambitions[0]}
              </span>
              {cv.ambitions.length > 1 ? (
                <>
                  {' '}
                  ou{' '}
                  <span
                    className="uk-label uk-text-lowercase"
                    style={{
                      lineHeight: 'unset',
                      verticalAlign: 'bottom',
                      fontSize: 'inherit',
                    }}
                  >
                    {cv.ambitions[1]}
                  </span>
                </>
              ) : (
                ''
              )}
              {cv.careerPathOpen ? (
                <>
                  {` mais reste ${
                    cv.user.candidat.gender === 1 ? 'ouverte' : 'ouvert'
                  } à toute autre
            proposition.`}
                </>
              ) : (
                '.'
              )}
            </p>
            <div className="uk-position-relative uk-margin-medium-top">
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: 0,
                  right: 0,
                }}
              >
                <a
                  href="#cv-fiche"
                  data-uk-scroll="offset: 80"
                  className={actionDisabled ? 'uk-disabled' : undefined}
                >
                  <IconNoSSR
                    name="triangle-down"
                    className={
                      actionDisabled ? 'uk-text-muted' : 'uk-text-primary'
                    }
                    ratio="2"
                  />
                </a>
              </div>
              <p className="uk-margin-bottom-small uk-text-lead">
                Partager mon CV
              </p>
              <GridNoSSR row gap="small" center>
                <LinkedinShareButton
                  disabled={actionDisabled}
                  onShareWindowClose={openNewsletterModal}
                  url={link}
                  title={title}
                  description={sharedDescription}
                  style={{
                    cursor: !actionDisabled && 'pointer',
                    color: actionDisabled ? '#999' : 'white',
                    backgroundColor: actionDisabled ? '#e5e5e5' : '#F55F24',
                    opacity: 1,
                  }}
                  className="uk-icon-link uk-icon-button uk-background-primary"
                >
                  <IconNoSSR
                    className={!actionDisabled ? 'ent-text-white' : undefined}
                    name="linkedin"
                    ratio={1.2}
                  />
                </LinkedinShareButton>
                <FacebookShareButton
                  disabled={actionDisabled}
                  onShareWindowClose={openNewsletterModal}
                  url={link}
                  quote={sharedDescription}
                  hashtags={hashtags}
                  style={{
                    cursor: !actionDisabled && 'pointer',
                    color: actionDisabled ? '#999' : 'white',
                    backgroundColor: actionDisabled ? '#e5e5e5' : '#F55F24',
                    opacity: 1,
                  }}
                  className="uk-icon-link uk-icon-button uk-background-primary"
                >
                  <IconNoSSR
                    className={!actionDisabled ? 'ent-text-white' : undefined}
                    name="facebook"
                    ratio={1.2}
                  />
                </FacebookShareButton>
                <TwitterShareButton
                  disabled={actionDisabled}
                  onShareWindowClose={openNewsletterModal}
                  url={link}
                  title={sharedDescription}
                  hashtags={hashtags}
                  via="R_Entourage"
                  style={{
                    cursor: !actionDisabled && 'pointer',
                    color: actionDisabled ? '#999' : 'white',
                    backgroundColor: actionDisabled ? '#e5e5e5' : '#F55F24',
                    opacity: 1,
                  }}
                  className="uk-icon-link uk-icon-button uk-background-primary"
                >
                  <IconNoSSR
                    className={!actionDisabled ? 'ent-text-white' : undefined}
                    name="twitter"
                    ratio={1.2}
                  />
                </TwitterShareButton>
                <WhatsappShareButton
                  disabled={actionDisabled}
                  onShareWindowClose={openNewsletterModal}
                  url={link}
                  title={sharedDescription}
                  style={{
                    cursor: !actionDisabled && 'pointer',
                    color: actionDisabled ? '#999' : 'white',
                    backgroundColor: actionDisabled ? '#e5e5e5' : '#F55F24',
                    opacity: 1,
                  }}
                  className="uk-icon-link uk-icon-button uk-background-primary"
                >
                  <IconNoSSR
                    className={!actionDisabled && 'ent-text-white'}
                    name="whatsapp"
                    ratio={1.2}
                  />
                </WhatsappShareButton>
              </GridNoSSR>
              <ModalShareCV
                id={`info-share-${cv.user.candidat.firstName}`}
                firstName={cv.user.candidat.firstName}
              />
            </div>
          </div>
          <GridNoSSR gap="large" eachWidths={['expand', 'auto@s']}>
            <GridNoSSR column>
              {cv.experiences.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mes compétences</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <dl className="uk-description-list">
                    {cv.experiences.map((exp, i) => (
                      <>
                        {exp.skills && (
                          <dt key={i} style={{ display: 'block' }}>
                            {exp.skills.map((name, key) => (
                              <span
                                key={key}
                                className="uk-label uk-text-lowercase uk-margin-small-right"
                              >
                                {name}
                              </span>
                            ))}
                          </dt>
                        )}
                        <dd className="uk-margin-small-top">
                          {exp.description}
                        </dd>
                      </>
                    ))}
                  </dl>
                </div>
              )}
              {cv.story && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mon histoire</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <p className="">
                    {cv.story.split('\n').reduce((acc, item, key, arr) => {
                      if (key < arr.length - 1 && key > 0) {
                        return [...acc, <br />, item];
                      }
                      return [...acc, item];
                    }, [])}
                  </p>
                </div>
              )}
              {/* cv.reviews */}
              {cv.reviews && cv.reviews.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">
                    Mes recommandations
                  </h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <GridNoSSR gap="small" column>
                    {cv.reviews.map((review, i) => (
                      <div key={i}>
                        <GridNoSSR gap="small" column>
                          <div>
                            <IconNoSSR
                              flip
                              className="uk-text-primary"
                              name="quote-right"
                              ratio={1.4}
                            />
                            <p className="uk-margin-remove">{review.text}</p>
                            <GridNoSSR
                              className="uk-margin-small-top"
                              eachWidths={['expand', 'auto']}
                              between
                              row
                            >
                              <p className="uk-text-meta uk-margin-remove-top">
                                <span className="uk-text-bold">
                                  {review.name}
                                </span>
                                , {review.status}
                              </p>
                              <IconNoSSR
                                className="uk-text-muted uk-width-1-1 uk-text-right"
                                name="quote-right"
                                ratio={0.8}
                              />
                            </GridNoSSR>
                          </div>
                        </GridNoSSR>
                      </div>
                    ))}
                  </GridNoSSR>
                </div>
              )}
            </GridNoSSR>
            <GridNoSSR column>
              <div className="">
                <h3 className="uk-margin-small-bottom">Mes infos pratiques</h3>
                <hr className="uk-divider-small uk-margin-remove-top" />
                <ul className="uk-list">
                  {cv.contracts && cv.contracts.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="file-text" />{' '}
                      {cv.contracts.join(' / ')}
                    </li>
                  )}
                  {cv.location && cv.location.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="location" />{' '}
                      {cv.location}
                    </li>
                  )}
                  {cv.languages && cv.languages.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="users" />{' '}
                      {cv.languages.join(' / ')}
                    </li>
                  )}
                  {cv.transport && cv.transport.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="cart" />{' '}
                      {cv.transport}
                    </li>
                  )}
                  {cv.availability && cv.availability.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="calendar" />{' '}
                      {cv.availability}
                    </li>
                  )}
                </ul>
              </div>
              {cv.passions.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mes hobbies</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <ul className="uk-list">
                    {cv.passions.map((item, i) => (
                      <li id={i} key={i}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </GridNoSSR>
          </GridNoSSR>
          <hr />
          <GridNoSSR column middle>
            <p className="uk-text-center uk-width-xlarge@m">
              Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
              intégration en entreprise par le projet LinkedOut. Pour plus
              d&apos;information, contactez:
              <br />
              <a
                className={`uk-link-text uk-text-primary${
                  actionDisabled ? ' uk-disabled' : ''
                }`}
                target='_blank'
                rel="noopener noreferrer"
                href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
              >
                {process.env.MAILJET_CONTACT_EMAIL}
              </a>
            </p>
            <ImgNoSSR
              alt="logo linkedout"
              className="uk-width-small"
              src="/static/img/01-linkedout-orange-complet.png"
            />
          </GridNoSSR>
        </GridNoSSR>
      </div>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          <div className="uk-text-primary">
            Vous avez une offre d&rsquo;emploi
          </div>{' '}
          à me proposer ?
        </h2>
        <Button
          disabled={actionDisabled}
          style='secondary'
          toggle="target: #modal-send-opportunity">
          Contactez-moi{' '}<IconNoSSR name="chevron-right" />
        </Button>
        <ModalEdit
          id="modal-send-opportunity"
          title={`Proposer une opportunité à ${cv.user.candidat.firstName}`}
          description={
            "Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer des opportunités aux candidats. Écrivez vos mots d'encouragement ou contactez le coach plus bas dans la page CV !"
          }
          submitText="Envoyer"
          defaultValues={{
            isPublic: false,
            candidatId: {
              value: cv.UserId,
              label: `${cv.user.candidat.firstName}`,
            },
          }}
          formSchema={schema}
          onSubmit={(fields, closeModal) => {
            postOpportunity({
              ...fields,
              usersId: [cv.UserId],
              date: Date.now(),
            }, closeModal);
          }}
        />
      </div>
    </div>
  );
};

CVFiche.propTypes = {
  cv: PropTypes.shape().isRequired,
  actionDisabled: PropTypes.bool,
};

CVFiche.defaultProps = {
  actionDisabled: false,
};

export default CVFiche;
