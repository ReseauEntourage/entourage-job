/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidator from './FormValidator';
import rulesSpecialSkill from './rulesSpecialSkill';
import Api from '../../Axios';
import Input from './fields/Input';
import Textarea from './fields/TextArea';
import { GridNoSSR, Button } from '../utils';

const DEFAULT_MESSAGE = {
  name: '',
  email: '',
  localization: '',
  text: '',
};
const DEFAULT_VALID = {
  valid_name: undefined,
  valid_email: undefined,
  valid_localization: undefined,
  valid_text: undefined,
};

export default class FormContactCandidat extends Component {
  validator = new FormValidator(rulesSpecialSkill);

  constructor(props) {
    super(props);
    this.state = {
      message: { ...DEFAULT_MESSAGE },
      error: '',
    };
    this.cancelForm = this.cancelForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static get propTypes() {
    return {
      closeModal: PropTypes.func.isRequired,
      confirmMessageSent: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      confirmMessageSent: () => {},
    };
  }

  cancelForm() {
    const { closeModal } = this.props;
    this.setState({ ...DEFAULT_VALID });
    closeModal();
  }

  handleChange(event) {
    const key = event.target.name;
    const content = event.target.value;
    const { message: newMessage } = this.state;
    /* Validators start */
    const state = {};
    state[key] = content;
    const validation = this.validator.validate(state);
    if (validation[key] !== undefined) {
      const stateValidation = {};
      stateValidation[`valid_${key}`] = validation[key];
      this.setState(stateValidation);
    }
    /* Validators end */
    newMessage[key] = content;
    this.setState({ message: newMessage, error: '' });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { message } = this.state;
    const { confirmMessageSent } = this.props;
    /* Validators control before submit */
    const validation = this.validator.validate(message);
    if (validation.isValid) {
      Api.post('/api/v1/giveSkill', { message })
        .then(() => {
          this.setState({ message: { ...DEFAULT_MESSAGE } });
          confirmMessageSent();
        })
        .catch((error) => {
          let errorToDisplay = "Une erreur s'est produite";
          if (error.response.status === 403) {
            errorToDisplay = error.response.data;
          }
          this.setState({ error: errorToDisplay });
        });
    } else {
      const stateValidation = {};
      Object.keys(validation).forEach((key) => {
        if (key !== 'isValid') {
          stateValidation[`valid_${key}`] = validation[key];
        }
      });
      this.setState(stateValidation);
    }
  }

  render() {
    const { valid_name, valid_email, valid_localization, valid_text } = this
      .state
      ? this.state
      : '';
    const { error } = this.state;

    return (
      <>
        <form className="uk-form-stacked uk-grid-small" data-uk-grid>
          <GridNoSSR
            childWidths={['1-1']}
            items={[
              <Input
                id="input-name"
                type="text"
                name="name"
                valid={valid_name}
                title="Nom*"
                placeholder="Tapez votre texte"
                handleChange={this.handleChange}
              />,
              <Input
                id="input-email"
                type="email"
                name="email"
                valid={valid_email}
                title="Addresse mail*"
                placeholder="Tapez votre texte"
                handleChange={this.handleChange}
              />,
              <Input
                type="text"
                id="input-localization"
                name="localization"
                placeholder="Tapez votre texte"
                valid={valid_localization}
                title="Lieu d'habitation *"
                handleChange={this.handleChange}
              />,
              <Textarea
                type="text"
                id="input-text"
                placeholder="Tapez votre texte"
                name="text"
                valid={valid_text}
                title="Ce que vous pouvez apporter*"
                rows="7"
                handleChange={this.handleChange}
              />,
            ]}
          />
        </form>
        <div className="uk-flex uk-flex-right uk-width-1-1 uk-margin">
          <span
            className="uk-text-meta uk-flex-auto uk-margin-left"
            style={{ alignSelf: 'center' }}
          >
            * : Mentions obligatoires
          </span>
          <span
            className="uk-text-danger uk-margin-right"
            style={{ alignSelf: 'center' }}
          >
            {error}
          </span>
          <Button
            style="default"
            className="uk-margin-right"
            onClick={this.handleSubmit}
          >
            Annuler
          </Button>
          <Button style="primary" onClick={this.handleSubmit}>
            Envoyer
          </Button>
        </div>
      </>
    );
  }
}
