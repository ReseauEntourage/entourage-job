import React from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";

const MultipleCTA = ({showNumbers, showDividers, data}) => {
  return (
    <div className="uk-width-expand uk-flex uk-flex-wrap uk-flex-around">
      {
        data.map((item, index) => {
          return (
            <div key={index.toString()} className={`${showDividers ? '' : 'uk-flex-middle'} uk-flex uk-width-1-${data.length}@m uk-flex-column uk-flex-top uk-width-medium uk-padding-small`}>
              {
                item.img &&
                <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center uk-width-expand uk-margin-small-bottom">
                  <img src={item.img} width="" height="" alt=""/>
                </div>
              }
              {
                item.title &&
                <h3 className={`${showDividers ? '' : 'uk-text-center'} ${item.text ? '' : 'uk-flex-1'} uk-flex-middle uk-text-bold uk-flex`} style={{minHeight: 52}}>
                  {showNumbers && <div className="uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-position-absolute" style={{fontSize: 46, marginLeft: -40, lineHeight: 1}}>{index+1}</div>}{item.title}
                </h3>
              }
              {showDividers && <hr className="uk-divider-small uk-margin-remove-vertical" />}
              {
                item.text &&
                <div className={`${item.button ? '' : 'uk-margin-remove-bottom'} uk-flex-1 uk-margin-medium-top uk-margin-medium-bottom`}>
                  {item.text}
                </div>
              }
              {
                item.button &&
                <Link href={item.button.href}>
                  <a
                    className="uk-button uk-button-primary uk-padding-small"
                    target={item.button.external ? "_blank" : ""}
                    data-uk-toggle={`target:${item.button.modal}`}
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
              }
          </div>
          );
        })
      }
    </div>
  );
};

MultipleCTA.propTypes = {
  showNumbers: PropTypes.bool,
  showDividers: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.element,
    img: PropTypes.string,
    button: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      external: PropTypes.bool,
      modal: PropTypes.string
    }),
  })).isRequired
};

MultipleCTA.defaultProps = {
  showNumbers: false,
  showDividers: false
};

export default MultipleCTA;
