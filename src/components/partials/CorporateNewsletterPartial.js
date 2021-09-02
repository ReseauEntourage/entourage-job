/* global UIkit */
import React, { useState } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import { Icon, Grid, Section } from 'src/components/utils';
import Api from 'src/Axios';
import Button from 'src/components/utils/Button';
import { NEWSLETTER_ORIGINS } from 'src/constants';

const CorporateNewsletter = ({ style }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const onSubmit = async () => {
    if (validator.isEmail(email)) {
      try {
        await Api.post('/api/v1/cv/share', {
          email,
          origin: NEWSLETTER_ORIGINS.LKO_ENTREPRISES,
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
    <Section style={style}>
      <div className="uk-flex uk-flex-center uk-flex-middle uk-flex-column">
        <Grid
          eachWidths={['expand', 'auto']}
          className="uk-width-1-2@s"
          gap="collapse"
          middle
        >
          <div data-uk-form-custom="target: true" className="uk-width-1-1">
            <a className="uk-form-icon" disabled>
              <Icon name="mail" />
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
        </Grid>
        {!isValid && (
          <span className="uk-text-danger uk-padding-small">
            {!isValid && 'Adresse mail invalide'}
          </span>
        )}
      </div>
    </Section>
  );
};

CorporateNewsletter.propTypes = {
  style: PropTypes.oneOf(['default', 'muted']),
};

CorporateNewsletter.defaultProps = {
  style: 'default',
};

export default CorporateNewsletter;
