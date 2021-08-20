/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { IconNoSSR, GridNoSSR } from 'src/components/utils';
import Api from 'src/Axios';
import Button from 'src/components/utils/Button';
import { event } from 'src/lib/gtag';
import { NEWSLETTER_ORIGINS } from 'src/constants';

const NewsletterPartial = ({ padding, tag }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const onSubmit = async () => {
    if (validator.isEmail(email)) {
      event(tag);
      try {
        await Api.post('/api/v1/cv/share', {
          email,
          origin: NEWSLETTER_ORIGINS.LKO,
        });
        UIkit.notification(
          'Votre inscription à la newsletter a bien été prise en compte !',
          'success'
        );
        setEmail('');
      } catch {
        UIkit.notification('Une erreur est survenue', 'danger');
      }
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div id="profiles" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      <div className="uk-text-center">
        <h4 className="uk-align-center uk-text-bold uk-width-1-2@m">
          Inscrivez-vous à la newsletter pour avoir des nouvelles des candidats
          et être informé·e de l&apos;évolution du projet
        </h4>
      </div>
      {/* input */}
      <div className="uk-flex uk-flex-center uk-flex-middle uk-flex-column">
        <GridNoSSR
          eachWidths={['expand', 'auto']}
          className="uk-width-1-2@s"
          gap="collapse"
          middle
        >
          <div data-uk-form-custom="target: true" className="uk-width-1-1">
            <a className="uk-form-icon" disabled>
              <IconNoSSR name="mail" />
            </a>
            <input
              className="uk-input"
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
          <Button style="primary" onClick={onSubmit}>
            S&apos;abonner&nbsp;!
          </Button>
        </GridNoSSR>
        <span className="uk-text-danger uk-padding-small">
          {!isValid && 'Adresse mail invalide'}
        </span>
      </div>
    </div>
  );
};

NewsletterPartial.propTypes = {
  padding: PropTypes.bool,
  tag: PropTypes.shape(),
};

NewsletterPartial.defaultProps = {
  padding: true,
  tag: undefined,
};

export default NewsletterPartial;
