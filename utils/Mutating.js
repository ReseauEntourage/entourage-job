export function mutateFormSchema(schema, fields) {
  const newSchema = {
    formId: schema.formId,
    fields: [
      ...schema.fields
    ],
    rules: [
      ...schema.rules
    ]
  };

  const updatedFields = fields.map(({fieldId, props}) => {
    const indexToUpdate = newSchema.fields.findIndex((field) => field.id === fieldId);

    const fieldToUpdate = {
      ...newSchema.fields[indexToUpdate]
    };

    for(let i = 0; i < props.length; i += 1) {
      if(props[i].option) {
        const optionIndexToUpdate = fieldToUpdate.options.findIndex((option) => option.value === props[i].option);
        fieldToUpdate.options[optionIndexToUpdate][props[i].propName] = props[i].value;
      }
      else {
        fieldToUpdate[props[i].propName] = props[i].value;
      }
    }

    newSchema.fields[indexToUpdate] = fieldToUpdate;

    return fieldToUpdate;
  });

  return newSchema;
}
