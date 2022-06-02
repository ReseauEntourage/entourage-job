import * as SalesforceController from 'src/controllers/Salesforce';
import express from 'express';
import { auth } from 'src/controllers/Auth';

const router = express.Router();
/*

router.post('/login', auth(), (req, res) => {
  SalesforceController.loginToSalesForce()
    .then(() => {
      return res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
    });
});
*/

router.get('/companies', auth(), (req, res) => {
  const { search } = req.query;
  SalesforceController.searchCompanyByName(search)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/companies', auth(), (req, res) => {
  SalesforceController.createCompany(req.body)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.get('/offers/:id', auth(), (req, res) => {
  const { id } = req.params;
  SalesforceController.findOfferById(id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/offers', auth(), (req, res) => {
  SalesforceController.createOffer(req.body)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/process', auth(), (req, res) => {
  SalesforceController.createProcess(req.body)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.get('/process/:email/:offerId', auth(), (req, res) => {
  const { email, offerId } = req.params;
  SalesforceController.findProcessByCandidateEmailAndOfferId(email, offerId)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.get('/contacts/:email', auth(), (req, res) => {
  const { email } = req.params;
  SalesforceController.findCandidateByEmail(email)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/contacts', auth(), (req, res) => {
  SalesforceController.createContact(req.body)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

export default router;
