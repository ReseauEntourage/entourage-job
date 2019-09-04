import React from 'react';
import { Button, Section } from '../utils';

const DifferencePartial = () => (
  <Section style="default" >
    <h4 className="uk-text-bold uk-text-center uk-align-center uk-width-2-3@s">
      Vous sentez que vous pouvez{' '}
      <span className="uk-text-primary">faire la différence ?</span> À vous de
      jouer !
    </h4>
    <div
      className="uk-align-center uk-text-center uk-margin-large-top"
      data-uk-grid
    >
      <div className="uk-inline uk-padding-small">
        <Button style="primary">Je veux aider</Button>
      </div>
      <div className="uk-inline uk-padding-small uk-margin-remove">
        <Button style="default">Je veux recruter</Button>
      </div>
    </div>
  </Section>
);
export default DifferencePartial;
