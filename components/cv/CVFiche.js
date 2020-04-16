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

const CVFiche = ({ cv }) => {
  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const hashtags = ['LinkedOut'];
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
  const title = `${cv.user.candidat.firstName} - Entourage Jobs`;

  // desactivation des champs candidat et publique
  schema.fields[
    schema.fields.findIndex((field) => field.id === 'candidatId')
  ].disable = () => true;

  schema.fields[
    schema.fields.findIndex((field) => field.id === 'isPublic')
  ].disabled = true;

  const postOpportunity = async (opportunity) => {
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
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
    <Section style="muted">
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium ">
        <GridNoSSR childWidths={['1-1']}>
          <div className="uk-text-center">
            <h1 className="uk-text-bold uk-heading-medium uk-text-primary">
              {cv.user.candidat.firstName} {cv.user.candidat.lastName}
            </h1>
            {cv.catchphrase && (
              <p className="uk-width-xlarge uk-margin-auto">
                <IconNoSSR
                  className="uk-text-primary"
                  name="quote-right"
                  ratio={1.4}
                  flip
                />
                {cv.catchphrase}
                <IconNoSSR
                  className="uk-text-primary"
                  name="quote-right"
                  ratio={0.8}
                />
              </p>
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
            <IconNoSSR
              name="triangle-down"
              className="uk-text-primary"
              ratio="2"
            />
            <p className="uk-margin-remove-top uk-margin-small uk-text-lead">
              Partager mon CV
            </p>
            <GridNoSSR row gap="small" center>
              <LinkedinShareButton
                onShareWindowClose={openNewsletterModal}
                url={link}
                title={title}
                description={sharedDescription}
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-icon-button uk-background-primary"
              >
                <IconNoSSR
                  className="ent-text-white"
                  name="linkedin"
                  ratio={1.2}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                onShareWindowClose={openNewsletterModal}
                url={link}
                quote={sharedDescription}
                hashtags={hashtags}
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-icon-button uk-background-primary"
              >
                <IconNoSSR
                  className="ent-text-white"
                  name="facebook"
                  ratio={1.2}
                />
              </FacebookShareButton>
              <TwitterShareButton
                onShareWindowClose={openNewsletterModal}
                url={link}
                title={sharedDescription}
                hashtags={hashtags}
                via="R_Entourage"
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-icon-button uk-background-primary"
              >
                <IconNoSSR
                  className="ent-text-white"
                  name="twitter"
                  ratio={1.2}
                />
              </TwitterShareButton>
              <WhatsappShareButton
                onShareWindowClose={openNewsletterModal}
                url={link}
                title={sharedDescription}
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-icon-button uk-background-primary"
              >
                <IconNoSSR
                  className="ent-text-white"
                  name="whatsapp"
                  ratio={1.2}
                />
              </WhatsappShareButton>
            </GridNoSSR>
            <ModalShareCV
              id={`info-share-${cv.user.candidat.firstName}`}
              firstName={cv.user.candidat.firstName}
            />
            <ModalEdit
              id="modal-send-opportunity"
              title={`Proposer une opportunité à ${cv.user.candidat.firstName}`}
              description={
                "Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer des opportunités aux candidats. Écrivez vos mots d'encouragement ou contactez avec le coach plus bas dans la page CV !"
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
              onSubmit={(fields) =>
                postOpportunity({
                  ...fields,
                  usersId: [cv.UserId],
                  date: Date.now(),
                })
              }
            />
          </div>
          <GridNoSSR gap="large" eachWidths={['expand', 'auto@m']}>
            <GridNoSSR column>
              {cv.experiences.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">Mes compétences</h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  <dl className="uk-description-list">
                    {cv.experiences.map((exp, i) => (
                      <>
                        {exp.skills && (
                          <dt key={i}>
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
                  <p className="">{cv.story}</p>
                </div>
              )}
              {/* cv.reviews */}
              {cv.reviews && cv.reviews.length > 0 && (
                <div className="">
                  <h3 className="uk-margin-small-bottom">
                    Mes recommandations
                  </h3>
                  <hr className="uk-divider-small uk-margin-remove-top" />
                  {cv.reviews.map((review, i) => (
                    <li id={i} key={i}>
                      <p className="uk-text-small uk-margin-small">
                        <IconNoSSR
                          name="quote-right"
                          className="uk-text-primary"
                          flip
                          ratio={1.4}
                        />
                        {review.text}
                        <IconNoSSR
                          name="quote-right"
                          className="uk-text-primary"
                          ratio={0.8}
                        />
                      </p>
                      <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                        {review.name}
                      </p>
                      <p className="uk-margin-remove">{review.status}</p>
                    </li>
                  ))}
                </div>
              )}
            </GridNoSSR>
            <GridNoSSR column>
              <div className="">
                <h3 className="uk-margin-small-bottom">Mes infos pratiques</h3>
                <hr className="uk-divider-small uk-margin-remove-top" />
                <ul className="uk-list">
                  <li>
                    <IconNoSSR className="uk-text-primary" name="location" />{' '}
                    {cv.location && cv.location !== ''
                      ? cv.location
                      : 'Localisation non renseignée'}
                  </li>
                  {cv.user.candidat.email && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="user" />{' '}
                      <span>{cv.user.candidat.email}</span>
                    </li>
                  )}
                  {cv.user.candidat.phone && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="phone" />{' '}
                      <span>{cv.user.candidat.phone}</span>
                    </li>
                  )}
                  {cv.contracts.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="file-text" />{' '}
                      {cv.contracts.join(' / ')}
                    </li>
                  )}
                  {cv.languages.length > 0 && (
                    <li>
                      <IconNoSSR className="uk-text-primary" name="users" />{' '}
                      {cv.languages.join(' / ')}
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
          <GridNoSSR column middle>
            <p className="uk-text-center uk-width-xlarge@m">
              Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
              intégration en entreprise par le projet LinkedOut. Pour plus
              d&apos;information, contactez:
              <br />
              <a
                className="uk-link-text uk-text-primary"
                href="mailto:contact-linkedout@entouratge.social"
              >
                contact-linkedout@entouratge.social
              </a>
            </p>
            <ImgNoSSR
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
        <button
          type="button"
          data-uk-toggle="target: #modal-send-opportunity"
          className="uk-button uk-button-primary"
          style={{
            color: 'white',
            backgroundColor: '#F55F24',
            backgroundImage: 'none',
            textTransform: 'none',
            border: null,
            padding: '0px 20px',
            borderRadius: '2px',
          }}
        >
          Contactez-moi &gt;
        </button>
      </div>
    </Section>
  );
};

CVFiche.propTypes = {
  cv: PropTypes.shape().isRequired,
};

CVFiche.defaultProps = {};

export default CVFiche;
