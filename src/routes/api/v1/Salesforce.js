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
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/companies', auth(), (req, res) => {
  const { name, businessLine, address, department } = req.body;
  SalesforceController.createCompany(name, businessLine, address, department)
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.post('/contacts', auth(), (req, res) => {
  const { firstName, lastName, mail, phone, position, department, companyId } =
    req.body;
  SalesforceController.createContact(
    firstName,
    lastName,
    mail,
    phone,
    position,
    department,
    companyId
  )
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.get('/users', auth(), (req, res) => {
  const { email } = req.query;
  SalesforceController.searchUserByEmail(email)
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

export default router;
