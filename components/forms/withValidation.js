/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import FormValidator from './FormValidator';

// Voici un HOC sur les validation de champs pour les formulaires
// Cette fonction accepte un composant...
// prend en parametre un Formulaire, des regle de validation et 2 action (annulation du formulaire, apres envoie du formulaire)
export default function withValidation(WrappedForm, validatorRules) {
  const validator = new FormValidator(validatorRules);
  // ... et renvoie un autre composant...
  return class extends React.Component {
    // WrappedForm devra lier son context ("bind" et "this") aux fonction handleChange et handleSubmit

    // fonction permettant de verifier une champs d'entré utilisateur
    handleChange(event) {
      const { checked, name, type, value } = event.target;
      const { fields } = this.state;

      /* Validators start */
      fields.values[name] = type === 'checkbox' ? checked : value; // enregistre la valeur du champs
      const validation = validator.validate({ ...fields.values }); // envoie une copie des champs pour que le state ne soit pas altéré

      // enregistre la raison de la validation {isInvalid: boolean, message: string}
      if (validation[name] !== undefined) {
        fields[`valid_${name}`] = validation[name];
      }

      /* Validators end */
      this.setState({ fields });
    }

    // fonction d'envoie de formulaire
    // renvoie une promesse informant de la validité ou non des champs
    // si erreur renvoie les information erronné
    // si valide renvoie les valeurs des champs
    handleSubmit() {
      return new Promise((resolve, reject) => {
        const { fields } = this.state;
        /* Validators control before submit */
        const validation = validator.validate({ ...fields.values });
        if (validation.isValid) {
          resolve({ fields: fields.values });
        } else {
          // erreur de validation
          Object.keys(validation).forEach((key) => {
            if (key !== 'isValid') {
              fields[`valid_${key}`] = validation[key];
            }
          });
          this.setState({
            error: 'Un ou plusieurs champs sont invalides',
            fields,
          });
          reject({ validation });
        }
      });
    }

    render() {
      // Affiche le composant enrobé avec les données/fonctions à jour
      // On passe aussi toute autres props reçues.
      const { ...other } = this.props;

      return (
        <WrappedForm
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          {...other}
        />
      );
    }
  };
}
