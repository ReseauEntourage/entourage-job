/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FormValidator from './FormValidator';
import rulesInterestLinkedOut from './rulesInterestLinkedOut';
import Api from '../../Axios';
import Input from './fields/Input';
import Textarea from './fields/Textarea';
import './FormInterestLinkedOut.less';
import CheckboxCGU from './fields/CheckboxCGU';

const DEFAULT_MESSAGE = {
  name: '',
  email: '',
  phone: '',
  structure: '',
  message: '',
  cgu: false,
};
const DEFAULT_VALID = {
  valid_name: undefined,
  valid_email: undefined,
  valid_phone: undefined,
  valid_structure: undefined,
  valid_message: undefined,
  valid_cgu: undefined,
};

export default class FormInterestLinkedOut extends Component {
  validator = new FormValidator(rulesInterestLinkedOut);

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
      candidat: PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
      }).isRequired,
      closeModal: PropTypes.func.isRequired,
      confirmMessageSent: PropTypes.func.isRequired,
    };
  }

  cancelForm() {
    const { closeModal } = this.props;
    this.setState({ ...DEFAULT_VALID });
    closeModal();
  }

  handleChange(event) {
    const key = event.target.name;
    const content =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    const { message: newMessage } = this.state;

    console.log(content);
    /* Validators start */
    const state = {};
    state[key] = content;
    const validation = this.validator.validate(state);
    if (validation[key] !== undefined) {
      const stateValidation = {};
      stateValidation[`valid_${key}`] = validation[key];
      this.setState(stateValidation);
      console.log(stateValidation);
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
      Api.post('/api/v1/message', { message })
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
    const {
      valid_name,
      valid_email,
      valid_phone,
      valid_structure,
      valid_message,
      valid_cgu,
    } = this.state ? this.state : '';
    const { error } = this.state;

    return (
      <>
        <div className="uk-width-1-2">
          <form className="uk-form-stacked uk-grid-small" data-uk-grid>
            <fieldset className="uk-fieldset uk-width-1-1">
              <Input
                type="text"
                id="input-name"
                name="name"
                onChange={this.handleChange}
                title="Nom et prénom*"
                valid={valid_name}
              />
              <Input
                type="text"
                id="input-structure"
                name="structure"
                onChange={this.handleChange}
                title="Structure*"
                valid={valid_structure}
              />
              <Input
                type="email"
                id="input-email"
                name="email"
                onChange={this.handleChange}
                title="E-mail*"
                valid={valid_email}
              />
              <Input
                type="text"
                id="input-phone"
                name="phone"
                onChange={this.handleChange}
                title="Téléphone"
                valid={valid_phone}
              />
              <Textarea
                rows={1}
                id="input-message"
                name="message"
                onChange={this.handleChange}
                title="Écrivez vos motivations*"
                valid={valid_message}
              />
              <CheckboxCGU
                id="input-cgu"
                name="cgu"
                title={
                  <span>
                    J&apos;accepte les{' '}
                    <Link href="#">
                      <a>CGU</a>
                    </Link>
                  </span>
                }
                onChange={this.handleChange}
                valid={valid_cgu}
              />
            </fieldset>
          </form>
        </div>
        <div className="uk-margin-medium-top">
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
            <button
              type="button"
              className="uk-button uk-button-primary uk-margin-right"
              onClick={this.handleSubmit}
            >
              Envoyer
            </button>
            <button
              type="button"
              className="uk-button uk-button-default"
              name="cancel"
              onClick={this.cancelForm}
            >
              Annuler
            </button>
          </div>
        </div>
      </>
    );
  }
}
