import React from 'react';
import PropTypes from 'prop-types';
import {Button, IconNoSSR} from "../utils";
import Grid from '../utils/Grid';

const MultipleCTA = ({showNumbers, showHorizontalDividers, showVerticalDividers, data, spacing, className}) => {
  return (
    <div uk-height-match="target : h3" className={className}>
      <Grid
        childWidths={[`1-${data.length}@m`]}
        match
        gap={spacing}
        divider={showVerticalDividers}
        items={ data.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className="uk-flex uk-flex-column uk-flex-middle">
              {
                item.img &&
                <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center uk-margin-medium-bottom">
                  <img src={item.img} width="" height="" alt="" className="uk-height-max-small"/>
                </div>
              }
              <div className="uk-flex uk-flex-1">
                {showNumbers && <div className="uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-margin-small-top" style={{fontSize: 46, lineHeight: 1}}>{index+1}</div>}
                <div className="uk-flex uk-flex-column uk-flex-1">
                  {
                    item.title &&
                    <h3 className={`${item.text ? ' uk-flex-bottom' : 'uk-padding-small uk-text-center uk-flex-center uk-flex-middle uk-flex-1'} uk-text-bold uk-flex`}>
                      {item.title}
                    </h3>
                  }
                  {showHorizontalDividers && <hr className="uk-divider-small uk-margin-remove-vertical" />}
                  {
                    item.text &&
                    <div className={`${item.button ? '' : 'uk-margin-remove-bottom'} ${item.title ? 'uk-margin-medium-top' : ''} uk-flex-1 uk-margin-medium-bottom`}>
                      {item.text}
                    </div>
                  }
                  {
                    item.button &&
                    <div className={`${item.text ? 'uk-flex-start' : 'uk-flex-center'} uk-flex uk-flex-middle`}>
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
        })}/>
    </div>
  );
};

MultipleCTA.propTypes = {
  showNumbers: PropTypes.bool,
  showHorizontalDividers: PropTypes.bool,
  showVerticalDividers: PropTypes.bool,
  spacing: PropTypes.oneOf('small', 'medium', 'large'),
  className: PropTypes.string,
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
  showVerticalDividers: false,
  spacing: 'large',
  className: ''
};

export default MultipleCTA;
