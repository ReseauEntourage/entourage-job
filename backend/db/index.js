const models = require('./models');

models.CV.findAll({
  where: {
    status: 'Published',
    visibility: true,
  },
  attributes: { exclude: ['userId'] },
  include: [
    {
      model: models.Contract,
      as: 'contracts',
      through: { attributes: [] },
      attributes: ['id', 'name'],
    },
    {
      model: models.Language,
      as: 'languages',
      through: { attributes: [] },
      attributes: ['id', 'name'],
    },
    {
      model: models.Passion,
      as: 'passions',
      through: { attributes: [] },
      attributes: ['id', 'name'],
    },
    {
      model: models.Skill,
      as: 'skills',
      through: { attributes: [] },
      attributes: ['id', 'name'],
    },
    {
      model: models.Ambition,
      as: 'ambitions',
      through: { attributes: [] },
      attributes: ['id', 'name'],
    },
    {
      model: models.Experience,
      as: 'experiences',
      attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
    },
    {
      model: models.Review,
      as: 'reviews',
      attributes: ['id', 'text', 'status', 'name'],
    },
    {
      model: models.User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
    },
  ],
})
  // .then((a) => a.map((b) => b.toJSON()))
  // .then((a) => a[1])
  .then(console.log)
  .catch(console.error);
