import React from 'react';
import Link from 'next/link';
import { GridNoSSR, SimpleLink, ImgNoSSR, Background, Section } from '../utils';
import Button from "../utils/Button";

const AssociationEntourage = () => (
  <Background blend={{ colorHex: '#484848' }}>
    <Section className="uk-padding-remove-vertical">
      <GridNoSSR
        center
        column
        gap="large"
        childWidths={['auto']}
        className="uk-text-center"
      >
        <div className="uk-margin-medium-top">
          <ImgNoSSR src="/static/img/logo-entourage.svg" alt="logo-entourage" />
          <h1 className="uk-text-bold uk-margin-small">
            <span style={{ color: '#fff' }}>L&apos;association </span>
            <span className="uk-text-primary">Entourage</span>
          </h1>
        </div>
        <GridNoSSR middle eachWidths={['expand@s', 'auto', 'expand@s']} className="uk-light">
          <div style={{ color: '#fff' }}>
            <p className="uk-text-left">
              Entourage est une association fondée en 2014 qui vise à créer du
              lien social entre riverains et personnes SDF notamment grâce à
              l’application mobile &apos;Entourage&apos; qui permet de
              coordonner des actions de solidarité à l’échelle locale.
            </p>
            <Button
              href="https://www.entourage.social"
              style="default">
              Voir le site &gt;
            </Button>
          </div>
          <div className="uk-flex uk-flex-middle">
            <hr className="uk-divider-vertical uk-visible@s" />
          </div>
          <GridNoSSR
            row
            middle
            center
            gap="small"
            eachWidths={['auto uk-flex-last uk-flex-first@m', 'auto']}
          >
            <ImgNoSSR
              src="/static/img/app-screenshot.png"
              alt="app-screenshot entourage"
            />
            <GridNoSSR column gap="small">
              <ImgNoSSR height="47" width="168" src="/static/img/BTAndroid.png" alt="android" />
              <ImgNoSSR height="47" width="168" src="/static/img/BTApple.png" alt="ios" />
            </GridNoSSR>
          </GridNoSSR>
        </GridNoSSR>
      </GridNoSSR>
    </Section>
  </Background>
);
export default AssociationEntourage;
