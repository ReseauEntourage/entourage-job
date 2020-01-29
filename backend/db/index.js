const { models, sequelize } = require('./models');

const COMPLETE = [
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
];
// models.CV.findOne({
//   // where: { url: 'candidat-69e6acbf', status: 'Published' },
//   // group: ['version'],
//   order: [['version', 'DESC']],
//   attributes: { exclude: ['userId'] },
//   include: COMPLETE
// })
//   .then(console.log)
//   .then((a) => a.map((b) => b.toJSON()))
//   // .then((a) => a[1])
//   .then(console.log)
//   .catch(console.error);

models.CV.findByPk('cec691cf-04a1-4485-8442-0874c5b0da05', {
  include: COMPLETE,
})
  .then((cv) => [cv])
  .then((cvs) =>
    cvs
      .map((cv) => cv.toJSON())
      .filter((cv) => cv.skills)
      .sort((a, b) => a.createdAt - b.createdAt)
  )
  .then(JSON.stringify)
  .then(console.log)
  .catch(console.error);
