import React from 'react';
import {
  GridNoSSR,
  IconNoSSR,
  Section,
  SimpleLink,
  ImgNoSSR,
  Background,
} from './utils';

const Footer = () => {
  return (
    <footer id="footer">
      <Background blend={{ colorHex: '#484848' }}>
        <Section size="small">
          <GridNoSSR
            center
            column
            childWidths={['auto']}
            className="uk-text-center"
          >
            <SimpleLink href="https://www.entourage.social" isExternal>
              <ImgNoSSR
                src="/static/img/logo-entourage.svg"
                alt="logo-entourage"
              />
            </SimpleLink>
            <h3 className="uk-text-bold">
              <span style={{ color: '#fff' }}>L&apos;association </span>
              <span className="uk-text-primary">Entourage</span>
            </h3>
            <GridNoSSR eachWidths={['expand', 'auto', 'expand']}>
              <div style={{ color: '#fff' }}>
                <p className="uk-text-left">
                  Entourage est une association fondée en 2014 qui vise à créer
                  ?du lien social entre riverains et personnes SDF notamment
                  grâce à l’application mobile 'Entourage' qui permet de
                  coordonner des actions de solidarité à l’échelle locale.
                </p>
                <button>Voir le site ></button>
              </div>
              <hr className="uk-divider-vertical uk-divider-small" />
              <div />
            </GridNoSSR>
          </GridNoSSR>
        </Section>
      </Background>
      <Section style="secondary" size="medium">
        <GridNoSSR
          childWidths={['1-5@s', '1-2']}
          center
          match
          items={[
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/">Mentions légales</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/contact">Contact</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="https://www.entourage.social" isExternal>
                Entourage social
              </SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/about">À propos d&apos;Entourage</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/login">Espace candidat</SimpleLink>
            </div>,
          ]}
        />
        <div className="uk-flex-center uk-flex uk-flex-middle uk-margin-top">
          <hr className="uk-divider-vertical uk-margin-small-right uk-margin-small-left" />
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://www.linkedin.com/company/association-entourage/"
              target="_blank"
              isExternal
            >
              <IconNoSSR name="linkedin" ratio={2} />
            </SimpleLink>
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://www.facebook.com/EntourageReseauCivique/"
              target="_blank"
              isExternal
            >
              <IconNoSSR name="facebook" ratio={2} />
            </SimpleLink>
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://twitter.com/r_entourage/"
              target="_blank"
              isExternal
            >
              <IconNoSSR name="twitter" ratio={2} />
            </SimpleLink>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
