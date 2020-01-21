import React from 'react';
import PropsType from 'prop-types';

const HeaderBackoffice = ({ title, description }) => (
  <div className="uk-margin-large-bottom">
    <h2 className="uk-text-bold">{title}</h2>
    <p className="uk-text-lead uk-width-2-3@m">{description}</p>
    <hr className="ent-divier-backoffice uk-margin-large-top " />
  </div>
);
HeaderBackoffice.propsType = {
  title: PropsType.string.isRequired,
  description: PropsType.string.isRequired,
};
export default HeaderBackoffice;
