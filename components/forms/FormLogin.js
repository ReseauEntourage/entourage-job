/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import Input from './fields/Input';
import FooterForm from '../utils/FooterForm';
import { GridNoSSR } from '../utils';

const DEFAULT_MESSAGE = {
  email: '',
  password: '',
};
const DEFAULT_VALID = {
  valid_email: undefined,
  valid_password: undefined,
};

export default class FormSpecialSkill extends Component {
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

  static get propTypes() {
    return {
      // Gere la mise à jour des entrés utilisateur
      // prend en parametre un event (input, textarea...) renvoie void
      handleChange: PropTypes.func.isRequired,
      // Gere l'envoie du formulaire
      // renvoie une promesse informant si les champs sont corrects
      handleSubmit: PropTypes.func.isRequired,
      // action effectué lors de l'annulation d'un formulaire
      afterCancel: PropTypes.func.isRequired,
      // action effectué apres l'envoie du formulaire
      afterSubmit: PropTypes.func.isRequired,
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;
    const { afterSubmit } = this.props;

    handleSubmit()
      .then(({ values }) =>
        Api.post('/api/v1/login', {
          values,
        })
          .then(() => afterSubmit())
          .catch(() => {
            this.setState({ error: "Une erreur s'est produite" });
          })
      )
      .catch(console.error);
  }

  render() {
    const { fields, error, handleChange, onSubmit } = this.state;
    const { afterCancel } = this.props;

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
