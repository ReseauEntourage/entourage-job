import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

// function inputIsEmpty(id) {
//   /** Cette condition est indispensable avant de faire appel a document
//    * car le rendu a lieu côté serveur et n'a pas de document de défini.
//    * Source : https://stackoverflow.com/questions/35068451/reactjs-document-is-not-defined */
//   if (typeof window !== 'undefined') {
//     if (document.getElementById(id)) {
//       if (document.getElementById(id).value !== '') return false;
//       return true;
//     }
//   }
//   return true;
// }

const Textarea = ({
  id,
  name,
  placeholder,
  title,
  valid,
  rows,
  onChange,
  maxLength,
  defaultValue,
}) => {
  const [labelClass, setLabelClass] = useState('');

  function update(event) {
    setLabelClass(event.target.value.length > 0 && ' stay-small');
    onChange(event);
  }

  useEffect(() => {
    if (defaultValue) {
      update({ target: { name, value: defaultValue, type: 'textarea' } });
    }
  }, [defaultValue]);

  return (
    <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
      <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
        {title}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder || 'Tapez votre texte'}
        maxLength={maxLength}
        defaultValue={defaultValue}
        onChange={update}
        className={`uk-textarea uk-form-large ${
          valid !== undefined && valid.isInvalid ? 'uk-form-danger' : ''
        }`}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

Textarea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.bool,
  }),
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  defaultValue: PropTypes.string,
};

Textarea.defaultProps = {
  id: undefined,
  placeholder: 'Tapez votre texte',
  rows: 5,
  valid: undefined,
  maxLength: 1000,
  defaultValue: '',
  onChange: () => {},
};
export default Textarea;
