import React from 'react';
import PropTypes from 'prop-types';
import { Button, Section } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const SimpleSection = ({
  id,
  style,
  container,
  title,
  text,
  button,
  children,
  fontSize,
}) => {
  return (
    <Section container={container} style={style}>
      {/* Fix so that the anchor scroll to the right height */}
      <div id={id} style={{ marginTop: -140, paddingTop: 140 }} />
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <div className="uk-container-small">
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
            {title}
          </h2>
        </div>
        {fontSize === 'small' ? (
          <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
            {text}
          </h4>
        ) : (
          <h3 className="uk-align-center uk-text-center uk-margin-large-bottom">
            {text}
          </h3>
        )}
        {button && (
          <Button
            href={button.href}
            style="secondary"
            isExternal={button.external}
            newTab={button.external}
            toggle={button.modal}
            onClick={button.onClick}
          >
            {button.label} <IconNoSSR name="chevron-right" />
          </Button>
        )}
        {children}
      </div>
    </Section>
  );
};

SimpleSection.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  container: PropTypes.oneOf(['small', 'large']),
  title: PropTypes.element.isRequired,
  button: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    external: PropTypes.bool,
    modal: PropTypes.string,
    onClick: PropTypes.func,
  }),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.element,
  fontSize: PropTypes.oneOf(['small', 'large']),
};

SimpleSection.defaultProps = {
  style: 'default',
  container: 'small',
  button: undefined,
  children: undefined,
  fontSize: 'large',
};

export default SimpleSection;
