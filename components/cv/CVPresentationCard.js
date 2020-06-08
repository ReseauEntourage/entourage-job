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
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schema from '../forms/schema/formEditOpportunity';
import Axios from '../../Axios';
import ModalShareCV from '../modals/ModalShareCV';
import { GridNoSSR, ImgNoSSR } from '../utils';

const CVPresentationCard = ({ firstName, intro, userId, cv }) => {
  const hashtags = ['LinkedOut'];
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
  const title = `${firstName} - LinkedOut`;
  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;

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
        `Merci pour votre message, ${firstName} et son coach reviennent vers vous bientôt.`,
        'success'
      );
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };
  const openNewsletterModal = () =>
    UIkit.modal(`#info-share-${firstName}`).show();

  return (
    <div className="uk-card uk-card-default uk-card-body uk-margin-medium ">
      <GridNoSSR childWidths={['1-1']}>
        <div className="uk-text-center">
          <h1 className="uk-text-bold uk-heading-medium uk-text-primary">
            {firstName} {cv.user.candidat.lastName}
          </h1>
          <p className="uk-width-xlarge uk-margin-auto">
            <IconNoSSR
              className="uk-text-primary"
              name="quote-right"
              ratio={1}
            />
            {intro}
            <IconNoSSR
              className="uk-text-primary"
              name="quote-right"
              ratio={1}
            />
          </p>
          {/*  uk-text-emphasis uk-text-bold */}
          <h3 className="uk-width-xlarge uk-margin-auto">
            J&apos;aimerais beaucoup travailler dans{' '}
            <span className="uk-label uk-margin-small-right">
              {cv.ambitions[0]}
            </span>
            {cv.ambitions.length > 1 ? (
              <>
                {' '}
                ou
                <span className="uk-label uk-margin-small-right">
                  {cv.ambitions[1]}
                </span>
              </>
            ) : (
              ''
            )}
            {cv.careerPathOpen ? (
              <>
                <br />
                {` mais reste ${
                  cv.user.candidat.gender === 1 ? 'ouverte' : 'ouvert'
                } à toute autre
            proposition.`}
              </>
            ) : (
              '.'
            )}
          </h3>
          <IconNoSSR
            name="triangle-down"
            className="uk-text-primary"
            ratio="2"
          />
          {/* uk-text-emphasis uk-text-bold  */}
          <h3 className="uk-margin-remove-top">Partager mon CV</h3>
          <div className="uk-flex uk-flex-row uk-flex-center">
            <LinkedinShareButton
              onShareWindowClose={openNewsletterModal}
              url={link}
              title={title}
              description={sharedDescription}
              style={{ cursor: 'pointer' }}
              className="uk-icon-link uk-text-primary uk-margin-right"
            >
              <IconNoSSR name="linkedin" ratio={1.5} />
            </LinkedinShareButton>
            <FacebookShareButton
              onShareWindowClose={openNewsletterModal}
              url={link}
              quote={sharedDescription}
              hashtags={hashtags}
              style={{ cursor: 'pointer' }}
              className="uk-icon-link uk-text-primary uk-margin-right"
            >
              <IconNoSSR name="facebook" ratio={1.5} />
            </FacebookShareButton>
            <TwitterShareButton
              onShareWindowClose={openNewsletterModal}
              url={link}
              title={sharedDescription}
              hashtags={hashtags}
              via="R_Entourage"
              style={{ cursor: 'pointer' }}
              className="uk-icon-link uk-text-primary primary uk-margin-right"
            >
              <IconNoSSR name="twitter" ratio={1.5} />
            </TwitterShareButton>
            <WhatsappShareButton
              onShareWindowClose={openNewsletterModal}
              url={link}
              title={sharedDescription}
              style={{ cursor: 'pointer' }}
              className="uk-icon-link uk-text-primary"
            >
              <IconNoSSR name="whatsapp" ratio={1.5} />
            </WhatsappShareButton>
          </div>
          <ModalShareCV id={`info-share-${firstName}`} firstName={firstName} />
          <ModalEdit
            id="modal-send-opportunity"
            title={`Proposer une opportunité à ${firstName}`}
            description={
              "Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer des opportunités aux candidats. Écrivez vos mots d'encouragement ou contactez le coach plus bas dans la page CV !"
            }
            submitText="Envoyer"
            defaultValues={{
              isPublic: false,
              candidatId: {
                value: userId,
                label: `${firstName}`,
              },
            }}
            formSchema={schema}
            onSubmit={(fields, closeModal) => {
              postOpportunity({
                ...fields,
                usersId: [userId],
                date: Date.now(),
              }, closeModal);
            }}
          />
        </div>
        <GridNoSSR eachWidths={['expand', 'auto']}>
          <GridNoSSR>
            {cv.experiences.length > 0 && (
              <div className="">
                <h3 className="uk-margin-small-bottom">Mes compétences</h3>
                <hr className="uk-divider-small uk-margin-remove-top" />
                <dl className="uk-description-list">
                  {cv.experiences.map((exp, i) => (
                    <>
                      {exp.skills && (
                        <dt>
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
                      <dd className="uk-margin-small-top">{exp.description}</dd>
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
                <h3 className="uk-margin-small-bottom">Mes recommandations</h3>
                <hr className="uk-divider-small uk-margin-remove-top" />
                {cv.reviews.map((review, i) => (
                  <li id={i} key={i}>
                    <p className="uk-text-small uk-margin-small">
                      <IconNoSSR
                        name="quote-right"
                        className="uk-text-primary"
                      />
                      {review.text}
                      <IconNoSSR
                        name="quote-right"
                        className="uk-text-primary"
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
          <p className="uk-text-center uk-width-xlarge">
            Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
            intégration en entreprise par le projet LinkedOut. Pour plus
            d&apos;information, contactez:
            <br />
            <a
              className="uk-link-text uk-text-primary"
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
  );
};
CVPresentationCard.propTypes = {
  firstName: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  cv: PropTypes.object.isRequired,
};

export default CVPresentationCard;
