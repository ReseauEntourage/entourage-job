/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './fields/Input';
import FooterForm from '../utils/FooterForm';
import { UserContext } from '../store/UserProvider';

const DEFAULT_MESSAGE = {
  email: '',
  password: '',
};
const DEFAULT_VALID = {
  valid_email: undefined,
  valid_password: undefined,
};

export default class FormLogin extends Component {
  constructor(props) {
    super(props);
    const { handleChange, handleSubmit } = this.props;

    this.state = {
      fields: { values: DEFAULT_MESSAGE, ...DEFAULT_VALID },
      error: '',
      handleChange: handleChange.bind(this),
      handleSubmit: handleSubmit.bind(this),
      onSubmit: this.onSubmit.bind(this),
    };
  }

  static get contextType() {
    return UserContext;
  }

  static get propTypes() {
    return {
      // Gere la mise à jour des entrés utilisateur
      // prend en parametre un event (input, textarea...) renvoie void
      handleChange: PropTypes.func.isRequired,
      // Gere l'envoie du formulaire
      // renvoie une promesse informant si les champs sont corrects
      handleSubmit: PropTypes.func.isRequired,
      // action effectué apres l'envoie du formulaire
      afterSubmit: PropTypes.func.isRequired,
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;
    const { afterSubmit } = this.props;
    const { login } = this.context;
    handleSubmit()
      .then(({ fields: { email, password } }) => login(email, password))
      .then(() => {
        console.log('Connexin réussie');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error: "Une erreur s'est produite" });
      });
  }

  render() {
    const { fields, error, handleChange, onSubmit } = this.state;

    return (
      <form className="uk-form-stacked">
        <fieldset className="uk-fieldset">
          <Input
            type="email"
            name="email"
            id="specialskill-input-email"
            valid={fields.valid_email}
            title="Adresse mail *"
            placeholder="Tapez votre texte"
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            id="specialskill-input-password"
            valid={fields.valid_password}
            title="Mot de passe*"
            placeholder="Tapez votre Mot de passe"
            onChange={handleChange}
          />
        </fieldset>
        <FooterForm error={error} onSubmit={onSubmit} />
      </form>
    );
  }
}
