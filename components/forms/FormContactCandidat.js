import React, { Component } from "react";

export default class FormContactCandidat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      job: "",
      sectorActivity: "",
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
    console.log(event.target);
    console.log(event.target.name + ": " + event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
  };

  render() {
    console.log(this.state);
    return (
      <form className="uk-form-stacked uk-grid-small" data-uk-grid>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Prénom</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="firstName"
              className="uk-input"
              placeholder="Votre prénom"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Nom</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="lastName"
              className="uk-input"
              placeholder="Votre nom"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">email</label>
          <div className="uk-form-controls">
            <input
              type="email"
              id="form-stacked-text"
              name="email"
              className="uk-input"
              placeholder="E-mail de contact"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Téléphone</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="phone"
              className="uk-input"
              placeholder="Votre numéro de téléphone"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Nom du poste proposé</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="job"
              className="uk-input"
              placeholder="Poste proposé"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Secteur d'activité</label>
          <div className="uk-form-controls">
            <select
              name="sectorActivity"
              className="uk-select"
              onChange={this.handleChange.bind(this)}
            >
              <option value="">Sélectionnez un secteur d'activité</option>
              <option value="Informatique">Informatique</option>
              <option value="Restauration">Restauration</option>
            </select>
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Entreprise</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="company"
              className="uk-input"
              placeholder="Votre entreprise"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-4">
          <label className="uk-form-label" htmlFor="form-stacked-text">Localisation</label>
          <div className="uk-form-controls">
            <input
              type="text"
              id="form-stacked-text"
              name="localization"
              className="uk-input"
              placeholder="Localisation"
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="form-stacked-text">Votre message</label>
          <div className="uk-form-controls">
            <textarea
              name="message"
              className="uk-textarea"
              rows="7"
              style={{ width: "100%" }}
              placeholder={"Votre message pour " + this.props.candidat.firstName}
              onChange={this.handleChange.bind(this)}></textarea>
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
