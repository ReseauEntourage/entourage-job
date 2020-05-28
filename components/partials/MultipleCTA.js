import React from 'react';
import PropTypes from 'prop-types';
import {Button, IconNoSSR} from "../utils";

const MultipleCTA = ({showNumbers, showHorizontalDividers, showVerticalDividers, data}) => {
  return (
    <div className={`${showVerticalDividers ? 'uk-margin-large-top' : ''} uk-width-expand uk-flex uk-flex-wrap uk-flex-around uk-overflow-hidden`}>
      {
        data.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className={`uk-flex-middle uk-flex uk-width-1-${data.length}@m uk-flex-column uk-flex-top uk-width-medium uk-padding-small`}
              style={showVerticalDividers ? {borderLeft: 'solid 1px #f55f24', marginLeft: '-2px'} : {}}>
              {
                item.img &&
                <div className="uk-height-small uk-flex uk-flex-middle uk-flex-center uk-margin-medium-bottom uk-width-small">
                  <img src={item.img} width="" height="" alt=""/>
                </div>
              }
              <div className="uk-flex uk-flex-1">
                {showNumbers && <div className="uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-margin-small-top" style={{fontSize: 46, lineHeight: 1}}>{index+1}</div>}
                <div className="uk-flex uk-flex-column uk-flex-1">
                  {
                    item.title &&
                    <h3 className={`${showHorizontalDividers ? '' : 'uk-text-center  uk-flex-center'} ${showVerticalDividers ? 'uk-padding-small' : ''} ${item.text ? '' : 'uk-flex-1'} uk-text-bold uk-flex-middle uk-flex`} style={{minHeight: 70}}>
                      {item.title}
                    </h3>
                  }
                  {showHorizontalDividers && <hr className="uk-divider-small uk-margin-remove-vertical" />}
                  {
                    item.text &&
                    <div className={`${item.button ? '' : 'uk-margin-remove-bottom'} uk-flex-1 uk-margin-medium-top uk-margin-medium-bottom`}>
                      {item.text}
                    </div>
                  }
                  {
                    item.button &&
                      <div className="uk-flex uk-flex-middle uk-flex-center">
                        <Button
                          href={item.button.href}
                          style='primary'
                          isExternal={item.button.external}
                          newTab={item.button.external}
                          toggle={item.button.modal}>
                          {item.button.label}{' '}<IconNoSSR name="chevron-right" />
                        </Button>
                      </div>
                  }
                </div>
              </div>
          </div>
          );
        })
      }
    </div>
  );
};

MultipleCTA.propTypes = {
  showNumbers: PropTypes.bool,
  showHorizontalDividers: PropTypes.bool,
  showVerticalDividers: PropTypes.bool,
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
  showHorizontalDividers: false,
  showVerticalDividers: false
};

export default MultipleCTA;
