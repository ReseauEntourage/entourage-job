import React from 'react';
import {IconNoSSR, Section} from '../utils';
import Layout from "../Layout";

const Highlights = () => {
  const highlights = [
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
  ];

  return (
    <Section style='muted' id="highlights" container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-vertical">
          Que vous apporte{' '}<span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <h3 className="uk-width-1-2@m uk-align-center uk-text-center">
          LinkedOut vous aide à trouver un travail et à vous intégrer dans votre nouvelle entreprise
        </h3>
        <div className="uk-height-large uk-width-expand">
          <div className="uk-position-relative" data-uk-slider="">
            <div className="uk-slider-container uk-background-default">
              <ul className="uk-slider-items uk-child-width-1-1">
                {highlights.map(({description, img}) => {
                  return (
                    <li>
                      <div className="uk-flex uk-padding-small uk-flex-center uk-flex-wrap uk-flex-wrap-around">
                        <img src={img} className="uk-flex-1 uk-width-large uk-padding-small"  alt=""/>
                        <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle uk-padding-small">
                          {description}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
            </div>
            <div className="uk-hidden@l">
              <a
                href="#"
                className="uk-position-center-left uk-position-small"
                uk-slider-item="previous"
              >
                <IconNoSSR
                  className="uk-text-primary uk-icon-button uk-overlay-default"
                  name="chevron-left"
                  ratio={2}
                />
              </a>
              <a
                href="#"
                className="uk-position-center-right uk-position-small"
                uk-slider-item="next"
              >
                <IconNoSSR
                  className="uk-text-primary uk-icon-button uk-overlay-default"
                  name="chevron-right"
                  ratio={2}
                />
              </a>
            </div>
            <div className="uk-visible@l">
              <a
                href="#"
                className="uk-position-center-left-out uk-position-small"
                uk-slider-item="previous"
              >
                <IconNoSSR
                  className="uk-text-primary"
                  name="chevron-left"
                  ratio={2}
                />
              </a>
              <a
                href="#"
                className="uk-position-center-right-out  uk-position-small"
                uk-slider-item="next"
              >
                <IconNoSSR
                  className="uk-text-primary"
                  name="chevron-right"
                  ratio={2}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

Highlights.propTypes = {

};

Highlights.defaultProps = {
};

export default Highlights;
