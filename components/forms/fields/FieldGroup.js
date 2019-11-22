import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../../utils';

export default class FieldGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelClass: '',
    };
  }

  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(PropTypes.element).isRequired,
    };
  }

  setLabelClass(value) {
    this.setState({
      labelClass: value.length > 0 ? ' stay-small' : '',
    });
  }

  render() {
    const { id, title, fields } = this.props;
    const { labelClass } = this.state;

    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label
          className={`uk-form-label ${labelClass}`}
          htmlFor={id}
          // style={{ top: '6px' }}
        >
          {title}
        </label>
        <GridNoSSR childWidths={[`1-${fields.length}`]} items={fields} />
      </div>
    );
  }
}
