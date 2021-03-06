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

import { ImgNoSSR, SimpleLink } from '../utils';
import { GridNoSSR } from '../utils/Grid';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schema from '../forms/schema/formEditOpportunity';
import Api from '../../Axios';
import ModalShareCV from '../modals/ModalShareCV';
import Button from '../utils/Button';
import {
  formatParagraph,
  mutateFormSchema,
  sortExperiences,
  sortReviews,
} from '../../utils';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import { useUpdateSharesCount } from '../../hooks';
/**
 * Le cv en public et en preview
 */
const CVFiche = ({ cv, actionDisabled }) => {
  const updateSharesCount = useUpdateSharesCount();

  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const path = router.asPath.includes('?')
    ? router.asPath.slice(0, router.asPath.indexOf('?'))
    : router.asPath;
  const link = `${hostname}${path}`;
  const hashtags = ['LinkedOut'];
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  // Modification du texte sur le champ des candidats
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'candidatesId',
      props: [
        {
          propName: 'title',
          value: `Ajouter d'autres candidats à qui adresser l'offre en plus de ${cv.user.candidat.firstName}`,
        },
      ],
    },
  ]);

  const postOpportunity = async (opportunity, closeModal) => {
    try {
      await Api.post(`/api/v1/opportunity/`, opportunity);
      closeModal();
      UIkit.notification(
        `Merci pour votre message, ${cv.user.candidat.firstName} et son coach reviennent vers vous bientôt.`,
        'success'
      );
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };

  const openNewsletterModal = () => {
    return UIkit.modal(`#info-share-${cv.UserId}`).show();
  };

  const experiences = sortExperiences(cv.experiences);

  const shareSection = (
    <div className="uk-flex uk-flex-column uk-flex-middle">
      <p className="uk-margin-small-bottom uk-text-center uk-text-muted">
        Partager mon CV
      </p>
      <GridNoSSR row gap="small" center middle>
        <LinkedinShareButton
          disabled={actionDisabled}
          onShareWindowClose={() => {
            event(TAGS.PAGE_CV_PARTAGE_CV_LINKEDIN_CLIC);
            updateSharesCount(cv.UserId, 'linkedin');
            openNewsletterModal();
          }}
          url={link}
          title={title}
          summary={sharedDescription}
          className="uk-icon-button"
        >
          <IconNoSSR
            className={!actionDisabled ? 'ent-text-white' : undefined}
            name="linkedin"
            ratio={1.2}
          />
        </LinkedinShareButton>
        <FacebookShareButton
          disabled={actionDisabled}
          onShareWindowClose={() => {
            event(TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC);
            updateSharesCount(cv.UserId, 'facebook');
            openNewsletterModal();
          }}
          url={link}
          quote={sharedDescription}
          hashtags={hashtags}
          className="uk-icon-button"
        >
          <IconNoSSR
            className={!actionDisabled ? 'ent-text-white' : undefined}
            name="facebook"
            ratio={1.2}
          />
        </FacebookShareButton>
        <TwitterShareButton
          disabled={actionDisabled}
          onShareWindowClose={() => {
            event(TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC);
            updateSharesCount(cv.UserId, 'twitter');
            openNewsletterModal();
          }}
          url={link}
          title={sharedDescription}
          hashtags={hashtags}
          via="R_Entourage"
          className="uk-icon-button"
        >
          <IconNoSSR
            className={!actionDisabled ? 'ent-text-white' : undefined}
            name="twitter"
            ratio={1.2}
          />
        </TwitterShareButton>
        <WhatsappShareButton
          disabled={actionDisabled}
          onShareWindowClose={() => {
            event(TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC);
            updateSharesCount(cv.UserId, 'whatsapp');
            openNewsletterModal();
          }}
          url={link}
          title={sharedDescription}
          className="uk-icon-button"
        >
          <IconNoSSR
            className={!actionDisabled && 'ent-text-white'}
            name="whatsapp"
            ratio={1.2}
          />
        </WhatsappShareButton>
      </GridNoSSR>
    </div>
  );

  const contactSection = (
    <div className="uk-text-center">
      <h3 className="uk-text-bold">
        <span className="uk-text-primary">
          Vous avez une offre d&rsquo;emploi
        </span>{' '}
        à me proposer ?
      </h3>
      <div className="uk-flex uk-flex-center">
        <Button
          disabled={actionDisabled}
          style="secondary"
          onClick={() => {
            return event(TAGS.PAGE_CV_CONTACTEZ_MOI_CLIC);
          }}
          toggle="target: #modal-send-opportunity"
        >
          Contactez-moi <IconNoSSR name="chevron-right" />
        </Button>
      </div>
      <div>
        <ModalEdit
          id="modal-send-opportunity"
          title={`Proposer une opportunité à ${cv.user.candidat.firstName}`}
          description="Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité à un candidat spécifique."
          submitText="Envoyer"
          defaultValues={{
            isPublic: false,
          }}
          formSchema={mutatedSchema}
          onSubmit={async (fields, closeModal) => {
            const candidatesId = fields.candidatesId
              ? fields.candidatesId.map((candidateId) => {
                  return typeof candidateId === 'object'
                    ? candidateId.value
                    : candidateId;
                })
              : [];
            if (!candidatesId.includes(cv.UserId)) {
              candidatesId.push(cv.UserId);
            }
            event(TAGS.PAGE_CV_ENVOYER_OFFRE_CLIC);
            await postOpportunity(
              {
                ...fields,
                candidatesId: fields.isPublic ? null : candidatesId,
                date: Date.now(),
              },
              closeModal
            );
          }}
        />
      </div>
    </div>
  );

  return (
    <div id="cv-fiche" className="uk-container uk-position-relative">
      <div className="uk-card uk-card-default uk-card-body uk-card-large uk-margin-medium ">
        <GridNoSSR childWidths={['1-1']}>
          <div className="uk-text-center">
            <h1 className="uk-text-bold uk-heading-small uk-text-primary">
              {cv.user.candidat.firstName} {cv.user.candidat.lastName}
            </h1>
            {cv.catchphrase && (
              <div className="uk-flex uk-flex-center uk-margin-medium-top">
                <h4
                  className="uk-position-relative uk-text-italic"
                  style={{
                    width: 'fit-content',
                    marginBottom: '8px',
                  }}
                >
                  <IconNoSSR
                    className="uk-text-primary ent-quote-after"
                    name="quote-right"
                    ratio={1.2}
                    flip
                  />
                  <span className="uk-margin-small-left uk-margin-small-right">
                    {cv.catchphrase}
                  </span>
                  <IconNoSSR
                    className="uk-text-primary ent-quote-before"
                    name="quote-right"
                    ratio={0.8}
                  />
                </h4>
              </div>
            )}
            {/* uk-text-emphasis uk-text-bold */}
            {cv.ambitions && cv.ambitions.length > 0 && (
              <h4
                className="uk-width-xxlarge uk-margin-auto"
                style={{ fontWeight: 500 }}
              >
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
                    } à toutes autres propositions.`}
                  </>
                ) : (
                  '.'
                )}
              </h4>
            )}
            <div className="uk-position-relative">
              <div className="uk-margin-small-bottom">
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
              <GridNoSSR childWidths={['1-1']}>
                {contactSection}
                {shareSection}
              </GridNoSSR>
              <ModalShareCV
                id={`info-share-${cv.UserId}`}
                firstName={cv.user.candidat.firstName}
              />
            </div>
          </div>
          <GridNoSSR gap="large" eachWidths={['expand', '1-3@m']}>
            <GridNoSSR column>
              {experiences && experiences.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">
                    Mes expériences et compétences
                  </h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <dl className="uk-description-list">
                    {experiences.map((exp, i) => {
                      return (
                        <>
                          {exp.skills && (
                            <dt key={i} style={{ display: 'block' }}>
                              {exp.skills.map((name, key) => {
                                return (
                                  <span
                                    key={key}
                                    className="uk-label uk-text-lowercase uk-margin-small-right"
                                  >
                                    {name}
                                  </span>
                                );
                              })}
                            </dt>
                          )}
                          <dd className="uk-margin-small-top">
                            {formatParagraph(exp.description)}
                          </dd>
                        </>
                      );
                    })}
                  </dl>
                </div>
              )}
              {cv.story && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mon histoire</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <p className="">{formatParagraph(cv.story)}</p>
                </div>
              )}
              {/* cv.reviews */}
              {cv.reviews && cv.reviews.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">
                    Ils me recommandent
                  </h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <GridNoSSR gap="small" column>
                    {sortReviews(cv.reviews).map((review, i) => {
                      return (
                        <div key={i}>
                          <GridNoSSR gap="small" column>
                            <div>
                              <IconNoSSR
                                flip
                                className="uk-text-primary uk-margin-small-bottom"
                                name="quote-right"
                                ratio={1.2}
                              />
                              <p className="uk-margin-remove">
                                {formatParagraph(review.text)}
                              </p>
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
                      );
                    })}
                  </GridNoSSR>
                </div>
              )}
            </GridNoSSR>
            <GridNoSSR column gap="medium">
              <div className="">
                <h3 className="uk-margin-small-bottom">Mes infos pratiques</h3>
                <hr className="uk-divider-small uk-margin-remove-top" />
                <ul className="uk-list">
                  {cv.contracts && cv.contracts.length > 0 && (
                    <li className="uk-flex uk-flex-middle">
                      <IconNoSSR
                        className="uk-text-primary uk-margin-small-right"
                        name="file-text"
                        style={{ width: 20 }}
                      />{' '}
                      <span className="uk-flex-1">
                        {cv.contracts.join(' / ')}
                      </span>
                    </li>
                  )}
                  {cv.locations && cv.locations.length > 0 && (
                    <li className="uk-flex uk-flex-middle">
                      <IconNoSSR
                        className="uk-text-primary uk-margin-small-right"
                        name="location"
                        style={{ width: 20 }}
                      />{' '}
                      <span className="uk-flex-1">
                        {cv.locations.join(' / ')}
                      </span>
                    </li>
                  )}
                  {cv.availability && cv.availability.length > 0 && (
                    <li className="uk-flex uk-flex-middle">
                      <IconNoSSR
                        className="uk-text-primary uk-margin-small-right"
                        name="calendar"
                        style={{ width: 20 }}
                      />{' '}
                      <span className="uk-flex-1">{cv.availability}</span>
                    </li>
                  )}
                  {cv.languages && cv.languages.length > 0 && (
                    <li className="uk-flex uk-flex-middle">
                      <IconNoSSR
                        className="uk-text-primary uk-margin-small-right"
                        name="users"
                        style={{ width: 20 }}
                      />{' '}
                      <span className="uk-flex-1">
                        {cv.languages.join(' / ')}
                      </span>
                    </li>
                  )}
                  {cv.transport && cv.transport.length > 0 && (
                    <li className="uk-flex uk-flex-middle">
                      <IconNoSSR
                        className="uk-text-primary uk-margin-small-right"
                        name="car"
                        style={{ width: 20 }}
                      />{' '}
                      <span className="uk-flex-1">{cv.transport}</span>
                    </li>
                  )}
                </ul>
              </div>
              {cv.skills && cv.skills.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mes atouts</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <ul className="uk-list">
                    {cv.skills.map((item, i) => {
                      return (
                        <li id={i} key={i}>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {cv.passions && cv.passions.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mes passions</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <ul className="uk-list">
                    {cv.passions.map((item, i) => {
                      return (
                        <li id={i} key={i}>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </GridNoSSR>
          </GridNoSSR>
          <hr />
          {contactSection}
          {shareSection}
        </GridNoSSR>
      </div>
      <GridNoSSR column middle>
        <p className="uk-text-center uk-width-xlarge@m">
          Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
          intégration en entreprise par le projet LinkedOut. Pour plus
          d&apos;information, contactez:
          <br />
          <SimpleLink
            className={`uk-link-text uk-text-primary${
              actionDisabled ? ' uk-disabled' : ''
            }`}
            isExternal
            newTab
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>
        </p>
        <ImgNoSSR
          alt="logo linkedout"
          className="uk-width-small"
          src="/static/img/linkedout_logo_orange.png"
        />
      </GridNoSSR>
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
