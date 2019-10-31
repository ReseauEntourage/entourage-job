import Api from '../Axios';

const { assert } = require('chai');

describe('Tests des routes API', () => {
  describe('Partie CV', () => {
    describe('Récupérer tous les CVs', () => {
      it("doit retourner un tableau de CVs à l'appel API", (done) => {
        Api.get(`${process.env.SERVER_URL}/api/v1/cv`).then((res) => {
          assert.isArray(res.data, 'Tableau reçu');
          done();
        });
      });
    });
  });
});
