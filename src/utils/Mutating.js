const mutateFormSchema = (schema, fields, id) => {
  const newSchema = {
    id: id ? schema.id + id : schema.id,
    fields: [...schema.fields],
    rules: [...schema.rules],
  };

  fields.map(({ fieldId, props }) => {
    const indexToUpdate = newSchema.fields.findIndex((field) => {
      return field.id === fieldId;
    });

    const fieldToUpdate = {
      ...newSchema.fields[indexToUpdate],
    };

    for (let i = 0; i < props.length; i += 1) {
      if (props[i].option) {
        const optionIndexToUpdate = fieldToUpdate.options.findIndex(
          (option) => {
            return option.value === props[i].option;
          }
        );
        fieldToUpdate.options[optionIndexToUpdate][props[i].propName] =
          props[i].value;
      } else {
        fieldToUpdate[props[i].propName] = props[i].value;
      }
    }

    newSchema.fields[indexToUpdate] = fieldToUpdate;

    return fieldToUpdate;
  });

  return newSchema;
};

export { mutateFormSchema };
