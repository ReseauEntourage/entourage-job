import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Section } from '../utils';
import { NumberCard } from '../cards';
import { VALUES } from '../../constants';

const staticNumbers = [
  { value: '73%', description: 'Des candidats ont retrouvé un job' },
  { value: '120k', description: 'Partages sur les réseaux de leur CV' },
  { value: '300', description: "Offres d'emploi reçues" },
];

const NumberPartial = ({ nbShares }) => {
  const [numbers, setNumbers] = useState(staticNumbers);

  useEffect(() => {
    const updatedNumbers = numbers;

    const stringNumber = nbShares.toString();

    updatedNumbers[1].value = `${stringNumber.substring(
      0,
      stringNumber.length - 3
    )}k`;

    setNumbers([...updatedNumbers]);
  }, [nbShares]);

  return (
    <Section style="muted" id="profiles">
      <h2 className="uk-text-bold uk-text-center">
        Et le mieux c&apos;est que{' '}
        <span className="uk-text-primary">ça marche</span> !
      </h2>
      <p className="uk-text-center uk-margin-medium-bottom">
        Miah, Abdul, Laith,... ont retrouvé un emploi grâce à LinkedOut
      </p>
      <GridNoSSR
        center
        childWidths={['1-1', '1-2@s', '1-3@l']}
        items={numbers.map((content) => {
          return (
            <div className="uk-flex uk-flex-center">
              <NumberCard
                value={content.value}
                description={content.description}
              />
            </div>
          );
        })}
      />

      <iframe
        src="https://www.youtube.com/embed/1cfmgC2IqWs"
        width="1280"
        height="720"
        frameBorder="0"
        allowFullScreen
        data-uk-responsive
        data-uk-video="automute: true; autoplay: inview"
        title="linkedout"
        className="uk-margin-medium-top"
      />
    </Section>
  );
};

NumberPartial.propTypes = {
  nbShares: PropTypes.number,
};

NumberPartial.defaultProps = {
  nbShares: VALUES.SHARES,
};

export default NumberPartial;
