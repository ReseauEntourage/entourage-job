const FormValidatorErrorMessage = ({ valid_obj }) => {
  if (valid_obj !== undefined) {
    return (
      <div className="uk-text-meta uk-text-danger">
        {valid_obj.message}
      </div>
    )
  } else {
    return null;
  }
}

export default FormValidatorErrorMessage;