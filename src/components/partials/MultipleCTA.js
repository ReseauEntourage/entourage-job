import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils';
import Grid from 'src/components/utils/Grid';
import Img from 'src/components/utils/Img';
import { IconNoSSR } from 'src/components/utils/Icon';

const MultipleCTA = ({
  showNumbers,
  showHorizontalDividers,
  showVerticalDividers,
  data,
  spacing,
  className,
  animate,
  numberLines,
}) => {
  return (
    <div uk-height-match="target : h3" className={className}>
      <Grid
        childWidths={[`1-${data.length / numberLines}@m`]}
        match
        gap={spacing}
        divider={showVerticalDividers}
        items={data.map((item, index) => {
          return (
            <div
              uk-scrollspy={
                animate
                  ? `cls: uk-animation-slide-${
                      index % 2 === 0 ? 'bottom' : 'top'
                    }-small; delay: ${100 * (index + 1)};`
                  : ''
              }
              key={index.toString()}
              className="uk-flex uk-flex-column uk-flex-middle"
            >
              {item.img && (
                <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center uk-margin-medium-bottom">
                  <Img
                    src={item.img}
                    width=""
                    height=""
                    alt=""
                    className="uk-height-max-small"
                  />
                </div>
              )}
              <div className="uk-flex uk-flex-1">
                {showNumbers && (
                  <div
                    className="uk-text-bold uk-text-primary uk-text-large uk-margin-medium-right uk-margin-small-top"
                    style={{ fontSize: 46, lineHeight: 1 }}
                  >
                    {index + 1}
                  </div>
                )}
                <div className="uk-flex uk-flex-column uk-flex-1">
                  {item.title && (
                    <h3
                      className={`${
                        showHorizontalDividers
                          ? ' uk-flex-middle'
                          : 'uk-padding-small uk-text-center uk-flex-center uk-flex-middle uk-flex-1'
                      } uk-text-bold uk-flex`}
                    >
                      {item.title}
                    </h3>
                  )}
                  {showHorizontalDividers && (
                    <hr className="uk-divider-small uk-margin-remove-vertical" />
                  )}
                  {item.text && (
                    <div
                      className={`${
                        item.button ? '' : 'uk-margin-remove-bottom'
                      } ${
                        showHorizontalDividers ? 'uk-margin-medium-top' : ''
                      } ${
                        !showHorizontalDividers && item.title
                          ? 'uk-text-center'
                          : ''
                      } uk-flex-1 uk-margin-medium-bottom`}
                    >
                      {item.text}
                    </div>
                  )}
                  {item.button && (
                    <div
                      className={`${
                        showHorizontalDividers
                          ? 'uk-flex-start'
                          : 'uk-flex-center'
                      } uk-flex uk-flex-middle`}
                    >
                      <Button
                        href={item.button.href}
                        style="secondary"
                        isExternal={item.button.external}
                        newTab={item.button.external}
                        toggle={item.button.modal}
                        onClick={item.button.onClick}
                        size={item.button.size}
                      >
                        {item.button.label}
                        &nbsp;
                        <IconNoSSR name="chevron-right" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      />
    </div>
  );
};

MultipleCTA.propTypes = {
  showNumbers: PropTypes.bool,
  showHorizontalDividers: PropTypes.bool,
  showVerticalDividers: PropTypes.bool,
  spacing: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.element,
      img: PropTypes.string,
      button: PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string,
        external: PropTypes.bool,
        modal: PropTypes.string,
        onClick: PropTypes.func,
      }),
    })
  ).isRequired,
  animate: PropTypes.bool,
  numberLines: PropTypes.number,
};

MultipleCTA.defaultProps = {
  showNumbers: false,
  showHorizontalDividers: false,
  showVerticalDividers: false,
  spacing: 'large',
  className: '',
  animate: false,
  numberLines: 1,
};

export default MultipleCTA;
