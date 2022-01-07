const cleanCV = (model) => {
  if (!model) {
    return null;
  }
  const tmpCV = model.toJSON();
  if (tmpCV.skills) {
    tmpCV.skills = tmpCV.skills.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.contracts) {
    tmpCV.contracts = tmpCV.contracts.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.languages) {
    tmpCV.languages = tmpCV.languages.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.passions) {
    tmpCV.passions = tmpCV.passions.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.ambitions) {
    tmpCV.ambitions = tmpCV.ambitions.map(({ name, order, prefix }) => {
      return { name, order, prefix };
    });
  }
  if (tmpCV.businessLines) {
    tmpCV.businessLines = tmpCV.businessLines.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.locations) {
    tmpCV.locations = tmpCV.locations.map((o) => {
      return o.name;
    });
  }
  if (tmpCV.experiences) {
    tmpCV.experiences = tmpCV.experiences.map((e) => {
      if (e.skills) {
        return {
          ...e,
          skills: e.skills.map(({ name }) => {
            return name;
          }),
        };
      }
      return e;
    });
  }
  return tmpCV;
};

const cleanOpportunity = (model) => {
  if (!model) {
    return null;
  }
  const tmpCV = model.toJSON();
  if (tmpCV.businessLines) {
    tmpCV.businessLines = tmpCV.businessLines.map((o) => {
      return o.name;
    });
  }
  return tmpCV;
};

const controlText = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export { cleanCV, cleanOpportunity, controlText };
