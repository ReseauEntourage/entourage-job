import React, { useContext } from 'react';
import CountUp from 'react-countup';
import { GridNoSSR, IconNoSSR, Section } from '../utils';
import CVList from '../cv/CVList';
import Button from '../utils/Button';
import { INITIAL_NB_OF_CV_TO_DISPLAY } from '../../constants';
import { SharesCountContext } from '../store/SharesCountProvider';

const CandidatListPartial = () => {
  const { totalShares } = useContext(SharesCountContext);

  return (
    <Section style="muted" id="candidat">
      <GridNoSSR column middle eachWidths={['2-3@m', '1-1']}>
        <div className="uk-text-center">
          <h1 className="uk-text-bold uk-margin-remove-bottom">
            Ils sont <span className="uk-text-primary">motivés</span> pour
            travailler
          </h1>
          <h3 className="uk-text-bold uk-margin-remove-top">
            Votre partage peut tout{' '}
            <span className="uk-text-primary">changer</span>
          </h3>
          <p className="uk-margin-remove-bottom">
            Si vous pensez comme nous que chacun doit avoir sa place dans la
            société et en entreprise, partagez votre réseau professionnel avec
            ceux qui en ont le plus besoin.
          </p>
          <h4 className="uk-text-bold">
            Grâce à vous, ce sont déjà &nbsp;
            <span
              className="uk-text-primary uk-text-normal"
              style={{ fontSize: 38, fontWeight: 500 }}
            >
              {totalShares > 0 ? (
                <CountUp
                  duration={5}
                  delay={3}
                  end={totalShares}
                  preserveValue
                  formattingFn={(number) => {
                    let stringNumber = number.toString();
                    if (stringNumber.length > 4) {
                      stringNumber = `${stringNumber.slice(
                        0,
                        -3
                      )}\xa0${stringNumber.slice(-3)}`;
                    }
                    if (stringNumber.length > 7) {
                      stringNumber = `${stringNumber.slice(
                        0,
                        -7
                      )}\xa0${stringNumber.slice(-7)}`;
                    }
                    if (stringNumber.length > 10) {
                      stringNumber = `${stringNumber.slice(
                        0,
                        -11
                      )}\xa0${stringNumber.slice(-11)}`;
                    }
                    return stringNumber;
                  }}
                />
              ) : (
                0
              )}
            </span>
            &nbsp; partages de CV&nbsp;!
          </h4>
        </div>
        <CVList nb={INITIAL_NB_OF_CV_TO_DISPLAY} />
        <GridNoSSR middle column gap="collapse">
          <Button href="/candidats" style="secondary">
            Voir tous les candidats <IconNoSSR name="chevron-right" />
          </Button>
        </GridNoSSR>
      </GridNoSSR>
    </Section>
  );
};
export default CandidatListPartial;
