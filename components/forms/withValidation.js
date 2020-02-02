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
      const { checked, name, type, value, selectedIndex } = event.target;
      const { setValue, getValues, setValid } = this.state;

      let fieldValue;
      if (type === 'checkbox') {
        fieldValue = checked;
      } else if (type === 'select-one' && selectedIndex === 0) {
        fieldValue = null; // si on est sur le placeholder ( option sans valeur )
      } else fieldValue = value;

      /* Validators start */
      setValue(name, fieldValue); // enregistre la valeur du champs
      const validation = validator.validate(getValues()); // envoie une copie des champs pour que le state ne soit pas altéré

      // enregistre la raison de la validation {isInvalid: boolean, message: string}
      if (validation[name] !== undefined) {
        setValid(name, validation[name]);
      }

      /* Validators end */
      this.setState({
        error: '',
      });
    }

    // fonction d'envoie de formulaire
    // renvoie une promesse informant de la validité ou non des champs
    // si erreur renvoie les information erronné
    // si valide renvoie les valeurs des champs
    handleSubmit() {
      return new Promise((resolve, reject) => {
        const { getValues, setValid } = this.state;
        const values = getValues();
        /* Validators control before submit */
        const validation = validator.validate(values);
        if (validation.isValid) {
          resolve(values);
        } else {
          // erreur de validation
          Object.keys(validation).forEach((key) => {
            if (key !== 'isValid') {
              setValid(key, validation[key]);
            }
          });
          this.setState({
            error: 'Un ou plusieurs champs sont invalides',
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
