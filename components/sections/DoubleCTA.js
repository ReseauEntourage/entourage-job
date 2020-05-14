import React from 'react';
import { Section } from '../utils';
import PropTypes from 'prop-types';
import Link from "next/link";

const DoubleCTA = ({id, style, title, data}) => {
  return (
    <Section id={id} style={style}>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m">
          {title}
        </h1>
        <div className="uk-flex uk-flex-wrap uk-flex-around">
          {
            data.map((item) => {
              return (
                <div className="uk-flex uk-flex-column uk-flex-top uk-width-large uk-padding-small">
                  <h4 className="uk-width-xsmall uk-text-bold">
                    {item.title}
                  </h4>
                  <hr className="uk-divider-small uk-margin-remove-vertical" />
                  <p className="uk-flex-1">
                    {item.text}
                  </p>
                  <Link href={item.button.href}>
                    <a
                      className="uk-button uk-button-primary uk-padding-small"
                      style={{
                        color: 'white',
                        backgroundColor: '#F55F24',
                        backgroundImage: 'none',
                        textTransform: 'none',
                        border: null,
                        padding: '0px 20px',
                        borderRadius: '2px',
                      }}
                    >
                      {item.button.label} &gt;
                    </a>
                  </Link>
              </div>
              );
            })
          }
        </div>
      </div>
    </Section>
  );
};

DoubleCTA.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  title: PropTypes.element.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.element.isRequired,
    text: PropTypes.string.isRequired,
    button: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    }).isRequired,
  })).isRequired
};

DoubleCTA.defaultProps = {
  style: 'default'
};

export default DoubleCTA;
