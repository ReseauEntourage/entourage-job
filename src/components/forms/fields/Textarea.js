import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { usePrevious } from 'src/hooks/utils';

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
  value,
  disabled,
  hidden,
}) => {
  const [labelClass, setLabelClass] = useState('');

  const prevValue = usePrevious(value);

  function update(event) {
    setLabelClass(event.target.value.length > 0 && ' stay-small');
    onChange(event);
  }

  useEffect(() => {
    if (value !== prevValue) {
      setLabelClass((value && value.length > 0 && ' stay-small') || '');
      onChange({ target: { name, value: value || '', type: 'textarea' } });
    }
  }, [name, onChange, prevValue, value]);

  return (
    <div
      className={`uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
        hidden ? ' uk-hidden' : ''
      }`}
    >
      <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
        {title}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder || 'Tapez votre texte'}
        maxLength={maxLength}
        value={value || ''}
        onChange={(e) => {
          update(e);
        }}
        disabled={disabled}
        className={`uk-textarea uk-form-large ${
          valid !== undefined && valid.isInvalid ? 'uk-form-danger' : ''
        }`}
      />
      <div className="uk-flex uk-flex-between">
        <FormValidatorErrorMessage validObj={valid} />
        {maxLength && (
          <span className="uk-text-meta uk-text-right uk-flex-1">
            {maxLength - (value?.length ?? 0)} caractère(s) restant(s)
          </span>
        )}
      </div>
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
    message: PropTypes.string,
  }),
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
};

Textarea.defaultProps = {
  id: undefined,
  placeholder: 'Tapez votre texte',
  rows: 5,
  valid: undefined,
  maxLength: undefined,
  value: '',
  onChange: () => {},
  disabled: false,
  hidden: false,
};
export default Textarea;
