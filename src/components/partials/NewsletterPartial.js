/* global UIkit */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Section } from 'src/components/utils';
import Api from 'src/Axios';
import Button from 'src/components/utils/Button';
import { event } from 'src/lib/gtag';
import { NEWSLETTER_TAGS } from 'src/constants';
import { IconNoSSR } from 'src/components/utils/Icon';
import Checkbox from 'src/components/forms/fields/Checkbox';

const NewsletterPartial = ({ style, padding, tag }) => {
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('');
  const [status, setStatus] = useState('');
  const [isMailValid, setIsMailValid] = useState(true);
  const [isTagsValid, setIsTagsValid] = useState(true);

  const onSubmit = async () => {
    const mailValid = validator.isEmail(email);
    const tagsValid = !validator.isEmpty(zone) && !validator.isEmpty(status);

    if (!mailValid || !tagsValid) {
      setIsMailValid(mailValid);
      setIsTagsValid(tagsValid);
    } else {
      event(tag);
      try {
        await Api.post('/api/v1/mail/newsletter', {
          email,
          zone,
          status,
        });
        UIkit.notification(
          'Votre inscription à la newsletter a bien été prise en compte !',
          'success'
        );
        setEmail('');
      } catch {
        UIkit.notification('Une erreur est survenue', 'danger');
      }
      setIsMailValid(true);
      setIsTagsValid(true);
    }
  };

  return (
    <Section
      id="newsletterForm"
      style={style}
      className={!padding ? 'uk-padding-remove-vertical' : ''}
    >
      <div className="uk-text-center">
        <h4 className="uk-align-center uk-text-bold uk-width-1-2@m">
          Inscrivez-vous à la newsletter pour avoir des nouvelles des candidats
          et être informé·e de l&apos;évolution du projet&nbsp;!
        </h4>
      </div>
      <div className="uk-flex uk-flex-center uk-flex-middle uk-flex-column">
        <Grid
          className="uk-width-1-2@m"
          gap="collapse"
          middle
          column
          childWidths={['1-1']}
        >
          <div
            data-uk-form-custom="target: false"
            className="uk-width-1-1 uk-margin-small-bottom"
          >
            <a className="uk-form-icon" disabled>
              <IconNoSSR name="mail" />
            </a>
            <input
              className="uk-input ent-newsletter-input"
              type="email"
              placeholder="Votre adresse mail..."
              style={{
                borderBottom: 0,
                borderRadius: '2px 0 0 2px',
                paddingTop: 0,
              }}
              onChange={(e) => {
                return setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          {!isMailValid && (
            <div className="uk-text-danger uk-text-center">
              Adresse mail invalide.
            </div>
          )}
          <div>
            <Grid
              childWidths={['1-2', '1-3@m']}
              gap="small"
              center
              className="uk-margin-small-top uk-margin-small-bottom"
            >
              <div>
                <span className="uk-text-bold">Je suis</span>
                <div className="uk-margin-small-top">
                  {NEWSLETTER_TAGS.STATUS.map(({ tag: tagConst, label }) => {
                    return (
                      <Checkbox
                        removePadding
                        value={tagConst === status}
                        onChange={() => {
                          setStatus(tagConst);
                        }}
                        name="newsletterStatus"
                        id="newsletterStatus"
                        title={label}
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="uk-text-bold">J&apos;habite</span>
                <div className="uk-margin-small-top">
                  {NEWSLETTER_TAGS.ZONE.map(({ tag: tagConst, label }) => {
                    return (
                      <Checkbox
                        removePadding
                        value={tagConst === zone}
                        onChange={() => {
                          setZone(tagConst);
                        }}
                        name="newsletterZone"
                        id="newsletterZone"
                        title={label}
                      />
                    );
                  })}
                </div>
              </div>
            </Grid>
          </div>
          {!isTagsValid && (
            <div className="uk-text-danger uk-text-center">
              Veuillez renseigner les informations.
            </div>
          )}
          <div className="uk-flex uk-flex-center uk-margin-small-top">
            <Button style="primary" onClick={onSubmit}>
              S&apos;abonner&nbsp;!
            </Button>
          </div>
        </Grid>
      </div>
    </Section>
  );
};

NewsletterPartial.propTypes = {
  padding: PropTypes.bool,
  tag: PropTypes.shape(),
  style: PropTypes.oneOf(['default', 'muted']),
};

NewsletterPartial.defaultProps = {
  padding: true,
  tag: undefined,
  style: 'default',
};

export default NewsletterPartial;
