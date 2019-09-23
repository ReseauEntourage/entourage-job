import React, { Component } from "react";
import FormValidator from "./FormValidator";
import rulesContactCandidat from "./rulesContactCandidat";
import FormValidatorErrorMessage from "./FormValidatorErrorMessage";

export default class FormContactCandidat extends Component {

  validator = new FormValidator(rulesContactCandidat);

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      job: "",
      businessLine: "",
      company: "",
      localization: "",
      text: "",
      message: "",
    }
    this.handleChange = this.handleChange.bind(this);
  }

  static get defaultProps() {
    return {
      candidat: {
        id: "111",
        firstName: "Clément",
      }
    }
  }

  handleChange(event) {
    const key = event.target.name;
    const content = event.target.value;

    /* Validators start */
    const state = {};
    state[key] = content;
    const validation = this.validator.validate(state);
    if (validation[key] !== undefined) {
      const stateValidation = {};
      stateValidation["valid_" + key] = validation[key];
      this.setState(stateValidation);
    }
    /* Validators end */
    this.setState({ [key]: content });
  };

  handleSubmit(event) {
    event.preventDefault();
  };

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
      valid_message
    } = this.state ? this.state : "";

    return (
      <form className="uk-form-stacked uk-grid-small" data-uk-grid>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Prénom</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="firstName"
              className={"uk-input " + (valid_firstName !== undefined ? !valid_firstName.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Votre prénom"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_firstName} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Nom</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="lastName"
              className={"uk-input " + (valid_lastName !== undefined ? !valid_lastName.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Votre nom"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_lastName} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">E-mail</label>
          <div className="uk-form-controls">
            <input
              type="email"
              id="form-stacked-text"
              name="email"
              className={"uk-input " + (valid_email !== undefined ? !valid_email.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="E-mail de contact"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_email} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Téléphone</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="phone"
              className={"uk-input " + (valid_phone !== undefined ? !valid_phone.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Votre numéro de téléphone"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_phone} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Nom du poste proposé</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="job"
              className={"uk-input " + (valid_job !== undefined ? !valid_job.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Poste proposé"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_job} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Secteur d'activité</label>
          <div className="uk-form-controls">
            <select
              name="businessLine"
              className={"uk-select " + (valid_businessLine !== undefined ? !valid_businessLine.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              onChange={this.handleChange.bind(this)}
            >
              <option value="">Sélectionnez un secteur d'activité</option>
              <option value="Informatique">Informatique</option>
              <option value="Restauration">Restauration</option>
            </select>
            <FormValidatorErrorMessage valid_obj={valid_businessLine} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Entreprise</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="company"
              className={"uk-input " + (valid_company !== undefined ? !valid_company.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Votre entreprise"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_company} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Localisation</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="localization"
              className={"uk-input " + (valid_localization !== undefined ? !valid_localization.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              placeholder="Localisation"
              onChange={this.handleChange.bind(this)} />
            <FormValidatorErrorMessage valid_obj={valid_localization} />
          </div>
        </div>
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="form-stacked-text">Votre message</label>
          <div className="uk-form-controls">
            <textarea
              name="message"
              className={"uk-textarea " + (valid_message !== undefined ? !valid_message.isInvalid ? "uk-form-success" : "uk-form-danger" : "")}
              rows="7"
              style={{ width: "100%" }}
              placeholder={"Votre message pour " + this.props.candidat.firstName}
              onChange={this.handleChange.bind(this)}></textarea>
            <FormValidatorErrorMessage valid_obj={valid_message} />
          </div>
        </div>
        <div className="uk-flex uk-flex-right uk-width-1-1">
          <button className="uk-button uk-button-primary uk-margin-right">Envoyer</button>
          <button className="uk-button uk-button-default" onClick={() => UIkit.modal("#modalContactCandidat").hide()}>Annuler</button>
        </div>
      </form>
    );
  }
}
