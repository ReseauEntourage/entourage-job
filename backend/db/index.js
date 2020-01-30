// const { models, sequelize } = require('./models');

// const COMPLETE = [
//   {
//     model: models.Contract,
//     as: 'contracts',
//     through: { attributes: [] },
//     attributes: ['id', 'name'],
//   },
//   {
//     model: models.Language,
//     as: 'languages',
//     through: { attributes: [] },
//     attributes: ['id', 'name'],
//   },
//   {
//     model: models.Passion,
//     as: 'passions',
//     through: { attributes: [] },
//     attributes: ['id', 'name'],
//   },
//   {
//     model: models.Skill,
//     as: 'skills',
//     through: { attributes: [] },
//     attributes: ['id', 'name'],
//   },
//   {
//     model: models.Ambition,
//     as: 'ambitions',
//     through: { attributes: [] },
//     attributes: ['id', 'name'],
//   },
//   {
//     model: models.Experience,
//     as: 'experiences',
//     attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
//   },
//   {
//     model: models.Review,
//     as: 'reviews',
//     attributes: ['id', 'text', 'status', 'name'],
//   },
//   {
//     model: models.User,
//     as: 'user',
//     attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
//   },
// ];
// // models.CV.findOne({
// //   // where: { url: 'candidat-69e6acbf', status: 'Published' },
// //   // group: ['version'],
// //   order: [['version', 'DESC']],
// //   attributes: { exclude: ['userId'] },
// //   include: COMPLETE
// // })
// //   .then(console.log)
// //   .then((a) => a.map((b) => b.toJSON()))
// //   // .then((a) => a[1])
// //   .then(console.log)
// //   .catch(console.error);

// models.Opportunity.create({
//   title: 'title Ok Google',
//   category: '',
//   company: 'company Ok Google',
//   recruiterName: 'recruiterName Ok Google',
//   recruiterMail: 'recruiterMail Ok Google',
//   recruiterPhone: 'recruiterPhone Ok Google',
//   location: 'location Ok Google',
//   description: 'description Ok Google',
//   date: Date.now(),
// });
//   // .then((cv) => [cv])
//   // .then((cvs) =>
//   //   cvs
//   //     .map((cv) => cv.toJSON())
//   //     .filter((cv) => cv.skills)
//   //     .sort((a, b) => a.createdAt - b.createdAt)
//   // )
//   .then(console.log)
//   .catch(console.error);

const OpportunityController = require('../controllers/Opportunity');

// OpportunityController.createOpportunity({
//   title: 'Cest privé',
//   category: 'Private',
//   company: 'NBA',
//   recruiterName: '...',
//   recruiterMail: 'fkdsfs@fdskdf.fd',
//   recruiterPhone: '0987654321',
//   location: 'TQT',
//   description:
//     'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime nobis itaque beatae id temporibus! Omnis laboriosam veritatis architecto consequatur vel?',
//   date: Date.now(),
//   usersId: ['69e6acbf-48b5-44c4-b46c-cb165acc2e5e'],
// })

OpportunityController.getOpportunity(
  'e0bcee30-50ad-4ef8-8463-381cf8b1dcbc'
).then(console.log);
