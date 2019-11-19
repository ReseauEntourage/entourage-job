/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from '../fields/Textarea';
import FooterForm from '../../utils/FooterForm';

export default class FormMyStoryCV extends Component {
  constructor(props) {
    super(props);
    const { handleChange, handleSubmit, story } = this.props;

    this.state = {
      fields: {
        values: {
          story,
        },
        valid_story: undefined,
      },
      error: '',
      handleChange: handleChange.bind(this),
      handleSubmit: handleSubmit.bind(this),
      onSubmit: this.onSubmit.bind(this),
    };
  }

  static get propTypes() {
    return {
      story: PropTypes.string,
      handleChange: PropTypes.func.isRequired,
      handleSubmit: PropTypes.func.isRequired,
      afterSubmit: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      story: '',
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;
    const { afterSubmit } = this.props;

    handleSubmit()
      .then(({ fields }) => afterSubmit(fields.story))
      .catch(console.error);
  }

  render() {
    const { fields, error, handleChange, onSubmit } = this.state;

    return (
      <div className="uk-width-1-1">
        <form
          className="uk-form-stacked uk-grid-small uk-child-width-1-1"
          data-uk-grid
        >
          <fieldset className="uk-fieldset uk-width-1-1">
            <Textarea
              id="mystorycv-input-story"
              type="text"
              name="story"
              valid={fields.valid_story}
              placeholder="Tapez votre texte"
              title="Ce que vous pouvez apporter*"
              rows={7}
              value={fields.story}
              onChange={handleChange}
            />
          </fieldset>
          <div>
            <FooterForm error={error} onSubmit={onSubmit} />
          </div>
        </form>
      </div>
    );
  }
}
