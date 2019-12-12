import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';
import { Button, Section } from '../utils';
import CVEditWelcome from './CVEditWelcome';

const CVActions = ({ cv }) => {
  const userContext = useContext(UserContext);
  if (!userContext.user) {
    return null;
  }
  return (
    <Section>
      <CVEditWelcome cv={cv} />
      <hr
        className="uk-margin-medium-top"
        style={{ borderTop: '1px solid black' }}
      />
      <div className="uk-align-right uk-text-center" data-uk-grid>
        <div className="uk-inline uk-padding-small">
          <Button style="default">Prévisualiser la page</Button>
        </div>
        <div className="uk-inline uk-padding-small uk-margin-remove">
          <Button style="primary">Publier</Button>
        </div>
      </div>
    </Section>
  );
};

CVActions.propTypes = {
  cv: PropTypes.shape(),
};

CVActions.defaultProps = {
  cv: {},
};

export default CVActions;
