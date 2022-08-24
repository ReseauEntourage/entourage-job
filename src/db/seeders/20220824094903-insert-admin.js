const uuid = require('uuid');
const { encryptPassword } = require('src/controllers/Auth');

const password = 'Admin123!';

const { hash, salt } = encryptPassword(password);

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: uuid.v4(),
        email: 'admin@linkedout.fr',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        adminRole: null,
        password: hash,
        salt,
        gender: 0,
        phone: '+33699999999',
        zone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
