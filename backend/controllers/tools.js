const cleanCV = (model) => {
  if (!model) return null;
  const tmpCV = model.toJSON();
  if (tmpCV.skills) {
    tmpCV.skills = tmpCV.skills.map((o) => o.name);
  }
  if (tmpCV.contracts) {
    tmpCV.contracts = tmpCV.contracts.map((o) => o.name);
  }
  if (tmpCV.languages) {
    tmpCV.languages = tmpCV.languages.map((o) => o.name);
  }
  if (tmpCV.passions) {
    tmpCV.passions = tmpCV.passions.map((o) => o.name);
  }
  if (tmpCV.ambitions) {
    tmpCV.ambitions = tmpCV.ambitions.map((o) => o.name);
  }
  if (tmpCV.businessLines) {
    tmpCV.businessLines = tmpCV.businessLines.map((o) => o.name);
  }
  if (tmpCV.experiences) {
    tmpCV.experiences = tmpCV.experiences.map((e) => {
      if (e.skills) {
        return { ...e, skills: e.skills.map(({ name }) => name) };
      }
      return e;
    });
  }
  return tmpCV;
};

const cleanOpportunity = (model) => {
  if (!model) return null;
  const tmpCV = model.toJSON();
  if (tmpCV.businessLines) {
    tmpCV.businessLines = tmpCV.businessLines.map((o) => o.name);
  }
  return tmpCV;
};

const controlText = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

module.exports = {
  cleanCV,
  cleanOpportunity,
  controlText,
};
