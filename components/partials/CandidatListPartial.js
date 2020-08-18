import React from 'react';
import Link from 'next/link';
import CountUp from "react-countup";
import PropTypes from "prop-types";
import {GridNoSSR, IconNoSSR, Section} from '../utils';
import CVList from '../cv/CVList';
import Button from "../utils/Button";

const CandidatListPartial = ({nbShares}) => (
  <Section style="muted" id="candidat">
    <GridNoSSR column middle eachWidths={['2-3@m', '1-1']}>
      <div className="uk-text-center">
        <h2 className="uk-text-bold uk-margin-remove-bottom">
          Ils sont <span className="uk-text-primary">motivés</span> pour
          travailler
        </h2>
        <h3 className="uk-text-bold uk-margin-remove-top">
          Votre partage peut tout{' '}
          <span className="uk-text-primary">changer</span>
        </h3>
        <p className="uk-margin-remove-bottom">
          Ils ont la motivation, vous du réseau. Si vous pensez comme nous que chacun doit avoir sa place dans la société et en entreprise, partagez votre réseau professionnel à ceux qui en ont le plus besoin.
        </p>
        <h4 className="uk-text-bold">
          Grâce à vous, ce sont déjà{' '}&nbsp;
          <span className="uk-text-primary uk-text-normal" style={{fontSize: 38, fontWeight: 500}}>
             {
               nbShares > 0 ?
                 <CountUp
                   duration={5}
                   delay={3}
                   end={nbShares}
                   preserveValue
                   formattingFn={(number) => {
                     let stringNumber = number.toString();
                     if(stringNumber.length > 4) {
                       stringNumber = `${stringNumber.slice(0, -3)} ${stringNumber.slice(-3)}`;
                     }
                     if(stringNumber.length > 7) {
                       stringNumber = `${stringNumber.slice(0, -7)} ${stringNumber.slice(-7)}`;
                     }
                     if(stringNumber.length > 10) {
                       stringNumber = `${stringNumber.slice(0, -11)} ${stringNumber.slice(-11)}`;
                     }
                     return stringNumber;
                   }}
                 />
                 : 0
             }
          </span>
          &nbsp;{' '}partages de CV&nbsp;!
        </h4>
      </div>
      <CVList nb={9} />
      <GridNoSSR middle column gap="collapse">
        <Button
          href="/candidats"
          style='secondary'>
          Voir tous les candidats{' '}<IconNoSSR name="chevron-right" />
        </Button>
      </GridNoSSR>
    </GridNoSSR>
  </Section>
);

CandidatListPartial.propTypes = {
  nbShares: PropTypes.number,
};

CandidatListPartial.defaultProps = {
  nbShares: 0
};

export default CandidatListPartial;
