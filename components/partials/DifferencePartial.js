import React from 'react';
import { Button, Section } from '../utils';

const DifferencePartial = () => (
  <Section style="primary" size="large">
    <div className="uk-text-center">
      <p className="uk-text-lead">
        Vous sentez que vous pouvez{' '}
        <span className="uk-text-primary">faire la différence ?</span> À vous de
        jouer !
      </p>
      <div className="uk-button-group">
        <Button style="primary">je veux aider</Button>
        <Button style="default">je veux recruter</Button>
      </div>
    </div>
  </Section>
);
export default DifferencePartial;
