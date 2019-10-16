/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidator from './FormValidator';
import rulesContactCandidat from './rulesContactCandidat';
import FormValidatorErrorMessage from './FormValidatorErrorMessage';
import Api from '../../Axios';

const DEFAULT_MESSAGE = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  job: '',
  businessLine: '',
  company: '',
  localization: '',
  text: '',
  message: '',
};
const DEFAULT_VALID = {
  valid_firstName: undefined,
  valid_lastName: undefined,
  valid_email: undefined,
  valid_phone: undefined,
  valid_job: undefined,
  valid_businessLine: undefined,
  valid_company: undefined,
  valid_localization: undefined,
  valid_text: undefined,
  valid_message: undefined,
};

export default class FormContactCandidat extends Component {
  validator = new FormValidator(rulesContactCandidat);

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
      valid_firstName,
      valid_lastName,
      valid_email,
      valid_phone,
      valid_job,
      valid_businessLine,
      valid_company,
      valid_localization,
      valid_message,
    } = this.state ? this.state : '';
    const { error } = this.state;
    const { candidat } = this.props;

    return (
      <>
        <form className="uk-form-stacked uk-grid-small" data-uk-grid>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-firstName">
                Prénom*
                <input
                  type="text"
                  id="input-firstName"
                  name="firstName"
                  className={`uk-input ${
                    valid_firstName !== undefined
                      ? !valid_firstName.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Votre prénom"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_firstName} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-lastName">
                Nom*
                <input
                  type="text"
                  id="input-lastName"
                  name="lastName"
                  className={`uk-input ${
                    valid_lastName !== undefined
                      ? !valid_lastName.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Votre nom"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_lastName} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-email">
                E-mail*
                <input
                  type="email"
                  id="input-email"
                  name="email"
                  className={`uk-input ${
                    valid_email !== undefined
                      ? !valid_email.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="E-mail de contact"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_email} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-phone">
                Téléphone
                <input
                  type="text"
                  id="input-phone"
                  name="phone"
                  className={`uk-input ${
                    valid_phone !== undefined
                      ? !valid_phone.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Votre numéro de téléphone"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_phone} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-job">
                Nom du poste proposé*
                <input
                  type="text"
                  id="input-job"
                  name="job"
                  className={`uk-input ${
                    valid_job !== undefined
                      ? !valid_job.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Poste proposé"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_job} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-businessLine">
                Secteur d&apos;activité
                <select
                  id="input-businessLine"
                  name="businessLine"
                  className={`uk-select ${
                    valid_businessLine !== undefined
                      ? !valid_businessLine.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">
                    Sélectionnez un secteur d&apos;activité
                  </option>
                  <option value="Informatique">Informatique</option>
                  <option value="Restauration">Restauration</option>
                </select>
              </label>
              <FormValidatorErrorMessage valid_obj={valid_businessLine} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-company">
                Entreprise
                <input
                  type="text"
                  id="input-company"
                  name="company"
                  className={`uk-input ${
                    valid_company !== undefined
                      ? !valid_company.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Votre entreprise"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_company} />
            </div>
          </div>
          <div className="uk-width-1-4">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-localization">
                Localisation*
                <input
                  type="text"
                  id="input-localization"
                  name="localization"
                  className={`uk-input ${
                    valid_localization !== undefined
                      ? !valid_localization.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  placeholder="Localisation"
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_localization} />
            </div>
          </div>
          <div className="uk-width-1-1">
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="input-message">
                Votre message*
                <textarea
                  id="input-message"
                  name="message"
                  className={`uk-textarea ${
                    valid_message !== undefined
                      ? !valid_message.isInvalid
                        ? 'uk-form-success'
                        : 'uk-form-danger'
                      : ''
                  }`}
                  rows="7"
                  style={{ width: '100%' }}
                  placeholder={`Votre message pour ${candidat.firstName}`}
                  onChange={this.handleChange.bind(this)}
                />
              </label>
              <FormValidatorErrorMessage valid_obj={valid_message} />
            </div>
          </div>
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
      </>
    );
  }
}
