/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Api from '../../Axios';
import Input from './fields/Input';
import Textarea from './fields/Textarea';
import CheckboxCGU from './fields/CheckboxCGU';
import FooterForm from '../utils/FooterForm';

const DEFAULT_MESSAGE = {
  email: '',
  text: '',
};
const DEFAULT_VALID = {
  valid_email: undefined,
  valid_text: undefined,
};

export default class FormContactUs extends Component {
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
      .then(({ fields }) => {
        Api.post('/api/v1/mail', {
          email: 'j.hospice@share-it.io',
          text: `Texte:\n${fields.text}\nemail:\n${fields.email}`,
          subject: `Je souhaite être aidé et réorienté - ${fields.email}`,
        })
          .then(() => afterSubmit())
          .catch((error) => {
            console.error(error);
            this.setState({ error: "Une erreur s'est produite" });
          });
      })
      .catch(console.error);
  }

  render() {
    const { fields, error, handleChange, onSubmit } = this.state;
    const { afterCancel } = this.props;

    return (
      <div className="uk-width-1-1">
        <form className="uk-form-stacked uk-grid-small" data-uk-grid>
          <fieldset className="uk-fieldset uk-width-1-1">
            <Input
              id="contactUs-input-email"
              type="email"
              name="email"
              valid={fields.valid_email}
              title="Adresse mail*"
              placeholder="Tapez votre texte"
              onChange={handleChange}
            />
            <Textarea
              id="contactUs-input-text"
              type="text"
              placeholder="Tapez votre texte"
              name="text"
              valid={fields.valid_text}
              title="Ce que vous pouvez apporter*"
              rows={7}
              onChange={handleChange}
            />
            <CheckboxCGU
              id="contactUs-input-cgu"
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
          <FooterForm
            error={error}
            onSubmit={onSubmit}
            onCancel={afterCancel}
          />
        </form>
      </div>
    );
  }
}
