import React from 'react';
import { GridNoSSR, SimpleLink, ImgNoSSR, Background, Section } from '../utils';

const AssociationEntourage = () => (
  <Background blend={{ colorHex: '#484848' }}>
    <div className="uk-position-relative">
      <Section size="small">
        <GridNoSSR
          center
          column
          gap="large"
          childWidths={['auto']}
          className="uk-text-center"
        >
          <div>
            <SimpleLink href="https://www.entourage.social" isExternal>
              <ImgNoSSR
                src="/static/img/logo-entourage.svg"
                alt="logo-entourage"
              />
            </SimpleLink>
            <h1 className="uk-text-bold uk-margin-small">
              <span style={{ color: '#fff' }}>L&apos;association </span>
              <span className="uk-text-primary">Entourage</span>
            </h1>
          </div>
          <GridNoSSR middle eachWidths={['1-2@s uk-width-1-1', 'auto']}>
            <div style={{ color: '#fff' }}>
              <p className="uk-text-left">
                Entourage est une association fondée en 2014 qui vise à créer
                ?du lien social entre riverains et personnes SDF notamment grâce
                à l’application mobile &apos;Entourage&apos; qui permet de
                coordonner des actions de solidarité à l’échelle locale.
              </p>
              <button
                type="button"
                className="uk-button uk-button-primary"
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  backgroundImage: 'none',
                  textTransform: 'none',
                  boder: null,
                  padding: '0px 20px',
                  borderRadius: '2px',
                  border: 'solid 2px #fff ',
                }}
              >
                Voir le site &gt;
              </button>
            </div>
            <div className="uk-flex uk-flex-middle" style={{ height: '185px' }}>
              <hr className="uk-divider-vertical uk-visible@s" />
            </div>
          </GridNoSSR>
        </GridNoSSR>
      </Section>
      <div className="uk-position-cover uk-container">
        <GridNoSSR
          childWidths={['1-2@s', '1-1']}
          className="uk-height-1-1 uk-flex-right uk-flex-bottom"
          items={[
            <GridNoSSR row middle around gap="small" childWidths={['auto']}>
              <ImgNoSSR src="/static/img/app-screenshot.png" />
              <GridNoSSR column gap="small">
                <ImgNoSSR src="/static/img/BTAndroid.png" />
                <ImgNoSSR src="/static/img/BTApple.png" />
              </GridNoSSR>
            </GridNoSSR>,
          ]}
        />
      </div>
    </div>
  </Background>
);
export default AssociationEntourage;
