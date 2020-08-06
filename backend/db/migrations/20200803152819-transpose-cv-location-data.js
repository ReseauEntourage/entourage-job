const {Op} = require("sequelize");
const {LOCATIONS} = require("../../../constants");
const {models} = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return models.CV.findAll({
      where: {
        location: {
          [Op.not]: null
        }
      }
    })
      .then((cvList) => {
        return Promise.all(
          cvList.map((cv) => {
            let locations = [];
            if (cv.location.includes('Île-de-France') || cv.location.includes('Ile de France') || cv.location.includes('Région') || cv.location.includes('région')) {
              locations = [LOCATIONS[0]];
            } else if (cv.location.includes('banlieue') || cv.location.includes('Banlieue')) {
              locations = [LOCATIONS[0].children[0]];
            } else if (cv.location.includes('Villejuif')) {
              locations = [LOCATIONS[0].children[0].children[0]];
            } else if (cv.location.includes('Paris')) {
              locations = [LOCATIONS[0].children[0].children[3]];
            }

            return queryInterface.sequelize.transaction((t) => {
              return Promise.all(
                locations.map((location) => {
                  return models.Location.findOne({
                    where: {name: location.value},
                    transaction: t
                  })
                    .then((model) => {
                      if(model) {
                        return model;
                      }
                      return models.Location.create({name: location.value}, {transaction: t})
                        .then((createdModel) => {
                          return createdModel;
                        });
                    })
                })
              ).then((newLocations) => {
                return cv.addLocations(newLocations, {transaction: t});
              })
            });
          })
        )
      });
  },

  down: (queryInterface, Sequelize) => {

  }
};
