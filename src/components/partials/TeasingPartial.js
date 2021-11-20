import React from 'react';
import Countdown from 'react-countdown';
import moment from 'moment';
import PropTypes from 'prop-types';
import Img from 'src/components/utils/Img';
import { Button, Section } from 'src/components/utils';
import { addPrefix } from 'src/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const CountDown = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <Button
        href={{ pathname: '/candidats', query: { hideEmployed: true } }}
        style="default"
      >
        Découvrir les candidats
        <IconNoSSR name="chevron-right" />
      </Button>
    );
  }
  // Render a countdown
  return (
    <h1 className="uk-text-bold uk-text-secondary uk-margin-remove">
      {days}j {hours}h {minutes}m {seconds}s
    </h1>
  );
};

CountDown.propTypes = {
  days: PropTypes.number.isRequired,
  hours: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  completed: PropTypes.func.isRequired,
};

const TeasingPartial = () => {
  const content = (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
      <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold uk-text-center uk-margin-bottom uk-margin-remove-top">
          Une nouvelle promotion arrive bientôt&nbsp;!
        </h2>
        <h3
          className="uk-text-center uk-margin-remove-top"
          style={{ color: 'white' }}
        >
          Rendez-vous mi-octobre pour découvrir les nouveaux visages de la
          promo&nbsp;#4&nbsp;!
        </h3>
        <Countdown
          date={moment('15/10/2021', 'DD/MM/YYYY').toISOString()}
          renderer={(units) => {
            return <CountDown {...units} />;
          }}
        />
      </div>
    </div>
  );

  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <div>
        <div className="uk-inline uk-visible@m">
          <Img
            width="1500"
            height="1000"
            src="/static/img/new_candidates.jpg"
            alt="Visages LinkedOut"
          />
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            className="uk-position-cover"
          />
          <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
            {content}
          </div>
        </div>
        <div
          className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
          style={{
            backgroundImage: `url(${addPrefix(
              '/static/img/new_candidates.jpg'
            )})`,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          {content}
        </div>
      </div>
    </Section>
  );
};

export default TeasingPartial;
