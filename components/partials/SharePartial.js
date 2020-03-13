import React from 'react';
import Link from 'next/link';
import { Section, IconNoSSR, GridNoSSR } from '../utils';

const SharePartial = () => (
  <Section style="default" container="" id="share">
    <>
      <p className="uk-text-center">Suivez-nous sur :</p>
      <GridNoSSR center>
        {[
          {
            name: 'facebook',
            title: 'Facebook',
            href: 'https://www.facebook.com/EntourageReseauCivique/',
          },
          {
            name: 'twitter',
            title: 'Twitter',
            href: 'https://twitter.com/r_entourage/',
          },
          {
            name: 'linkedin',
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/company/association-entourage/',
          },
        ].map(({ name, title, href }, key) => (
          <Link href={href} key={key}>
            <a
              className="uk-button uk-button-primary"
              target="_blank"
              style={{
                color: 'white',
                backgroundColor: '#F55F24',
                backgroundImage: 'none',
                textTransform: 'none',
                boder: null,
                padding: '0px 20px',
                borderRadius: '2px',
              }}
            >
              {title} <IconNoSSR name={name} />
            </a>
          </Link>
        ))}
      </GridNoSSR>
    </>
  </Section>
);
export default SharePartial;
