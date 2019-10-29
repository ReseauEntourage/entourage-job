/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Api from '../../Axios';
import Input from './fields/Input';
import Textarea from './fields/Textarea';
import CheckboxCGU from './fields/CheckboxCGU';

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
        Api.post('/api/v1/giveSkill', {
          message: values,
        })
      )
      .then(() => afterSubmit())
      .catch((error) => {
        if (error.validation !== undefined) {
          // erreur de validation
          const { fields } = this.state;
          Object.keys(error.validation).forEach((key) => {
            if (key !== 'isValid') {
              fields[`valid_${key}`] = error.validation[key];
            }
          });
          this.setState({
            error: 'Un ou plusieurs champs sont invalides',
            fields,
          });
        } else {
          this.setState({ error: "Une erreur s'est produite" });
        }
      });
  }

  render() {
    const { fields, error, handleChange, onSubmit } = this.state;
    const { afterCancel } = this.props;

    return (
      <>
        <div className="uk-width-1-1 uk-width-2-3@m uk-width-1-2@xl">
          <form className="uk-form-stacked uk-grid-small" data-uk-grid>
            <fieldset className="uk-fieldset uk-width-1-1">
              <Input
                id="input-name"
                type="text"
                name="name"
                valid={fields.valid_name}
                title="Nom*"
                placeholder="Tapez votre texte"
                onChange={handleChange}
              />
              <Input
                id="input-email"
                type="email"
                name="email"
                valid={fields.valid_email}
                title="Addresse mail*"
                placeholder="Tapez votre texte"
                onChange={handleChange}
              />
              <Input
                type="text"
                id="input-localization"
                name="localization"
                placeholder="Tapez votre texte"
                valid={fields.valid_localization}
                title="Lieu d'habitation *"
                onChange={handleChange}
              />
              <Textarea
                type="text"
                id="input-text"
                placeholder="Tapez votre texte"
                name="text"
                valid={fields.valid_text}
                title="Ce que vous pouvez apporter*"
                rows={7}
                onChange={handleChange}
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
                onChange={handleChange}
                valid={fields.valid_cgu}
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
              onClick={onSubmit}
            >
              Envoyer
            </button>
            <button
              type="button"
              className="uk-button uk-button-default"
              name="cancel"
              onClick={afterCancel}
            >
              Annuler
            </button>
          </div>
        </div>
      </>
    );
  }
}
