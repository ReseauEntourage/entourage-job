import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../utils';
import Icon from "../../utils/Icon";

const ButtonPost = ({ text, icon, action, style }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      style={style}
      onClick={() => {
        if (!loading) {
          setLoading(true);
          action().finally(() => setLoading(false));
        }
      }}
    >
      <div className="uk-flex uk-flex-middle">
        {text}
        {
          loading ? (
            <div className="uk-margin-small-left" data-uk-spinner="ratio: .5" />
          ) : (
            icon && <Icon className="uk-margin-small-left" name={icon} />
          )
        }
      </div>
    </Button>
  );
};
ButtonPost.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func,
  style: PropTypes.string,
  icon: PropTypes.string
};
ButtonPost.defaultProps = {
  action: undefined,
  style: undefined,
  icon: undefined
};
export default ButtonPost;
