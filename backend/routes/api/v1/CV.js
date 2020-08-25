const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { auth } = require('../../../controllers/Auth');
const UserController = require('../../../controllers/User');
const CVController = require('../../../controllers/CV');
const ShareController = require('../../../controllers/Share');
const S3 = require('../../../controllers/aws');
const { sendMail } = require('../../../controllers/mail');
const { airtable } = require('../../../controllers/airtable');
const createPreviewImage = require('../../../shareImage');
const { USER_ROLES, CV_STATUS } = require("../../../../constants");
const { checkCandidatOrCoachAuthorization } = require('../../../utils');

const upload = multer({ dest: 'uploads/' });

/**
 * Route : POST /api/<VERSION>/cv
 * Description : Créé le CV
 */
router.post(
  '/',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  upload.single('profileImage'),
  (req, res) => {
    // si le cv est une string json le parser, sinon prendre l'objet
    const reqCV = typeof req.body.cv === 'string' ? JSON.parse(req.body.cv) : req.body.cv;

    checkCandidatOrCoachAuthorization(req, res, reqCV.UserId, async () => {
      switch (req.payload.role) {
        case USER_ROLES.CANDIDAT:
          reqCV.status = CV_STATUS.Pending.value;
          break;
        case USER_ROLES.COACH:
        case USER_ROLES.ADMIN:
          // on laisse la permission au coach et à l'admin de choisir le statut à enregistrer
          if (!reqCV.status) {
            reqCV.status = CV_STATUS.Published.value;
          }
          break;
        default:
          reqCV.status = CV_STATUS.Unknown.value;
          break;
      }
      // uploading image and generating preview image
      if (req.file) {
        const { path } = req.file;
        try {
          const fileBuffer = await sharp(path)
            .trim()
            .jpeg({ quality: 75 })
            .toBuffer();
          reqCV.urlImg = await S3.upload(
            fileBuffer,
            'image/jpeg',
            `${reqCV.UserId}.${reqCV.status}.jpg`
          );
        } catch (error) {
          console.error(error);
        } finally {
          fs.unlinkSync(path); // remove image localy after upload to S3
        }
      }
      // création de l'image publiée
      if (reqCV.status === CV_STATUS.Published.value) {
        try {
          const { Body } = await S3.download(reqCV.urlImg);
          reqCV.urlImg = await S3.upload(Body, 'image/jpeg', `${reqCV.UserId}.Published.jpg`);
        } catch (error) {
          console.error(error);
        }
      }
      // completion asynchrone de la generation de limage de preview
      const previewPromise = reqCV.urlImg
        ? UserController.getUser(reqCV.UserId)
          .then(({ firstName, gender }) =>
            // Génération de la photo de preview
            S3.download(reqCV.urlImg).then(({ Body }) => {
              return createPreviewImage(
                Body,
                firstName,
                reqCV.catchphrase,
                reqCV.ambitions,
                reqCV.skills,
                reqCV.locations,
                gender
              );
            })
          )
          .then((sharpData) => sharpData.jpeg().toBuffer())
          .then((buffer) =>
            S3.upload(buffer, 'image/jpeg', `${reqCV.UserId}.${reqCV.status}.preview.jpg`)
          )
          .then((previewUrl) => console.log('preview uploaded: ', previewUrl))
          .catch(console.error)
        : null;

      // création du corps du CV
      const cv = await CVController.createCV(reqCV);
      try {
        // notification mail to coach and admin
        if (req.payload.role === USER_ROLES.CANDIDAT) {
          const mailSubject = 'Soumission CV';
          const mailText = `Bonjour,\n\n${req.payload.firstName} vient de soumettre son CV.\nRendez-vous dans votre espace personnel pour le relire et vérifier les différents champs. Lorsque vous l'aurez validé, il sera mis en ligne.\n\nMerci de veiller tout particulièrement à la longueur des descriptions des expériences, à la cohérence des dates et aux fautes d'orthographe !\n\nL'équipe Entourage.`;
          // notification de l'admin
          await sendMail({
            toEmail: process.env.MAILJET_TO_EMAIL,
            subject: mailSubject,
            text: mailText,
          });
          // Récupération de l'email du coach pour l'envoie du mail
          console.log('USERID', req.payload.userToCoach);

          await UserController.getUser(req.payload.userToCoach)
            .then(({ email }) =>
              sendMail({
                toEmail: email,
                subject: mailSubject,
                text: mailText,
              })
            )
            .catch((err) => console.log('Pas de coach rattaché au candidat'));
        }
        // attente de la génération de l'image de preview
        await previewPromise;
        return res.status(200).json(cv);
      } catch (err) {
        console.log(err);
        // attente de la génération de l'image de preview
        await previewPromise;
        return res.status(401).send(`Une erreur est survenue`);
      }
    });
  }
);

/**
 * Route : POST /api/<VERSION>/cv
 * Description : Prise d'info partageur
 */
router.post('/share', auth(), (req, res) => {
  return airtable('newsletter').create(
    [
      {
        fields: {
          email: req.body.email,
        },
      },
    ],
    (err, records) => {
      if (err) {
        console.error(err);
        return res.status(401).send(`Une erreur est survenue`);
      }
      records.forEach((record) => {
        console.log(record.getId());
      });
      return res.status(200).json(records);
    }
  );
});

/**
 * Route : POST /api/<VERSION>/cv/count
 * Description : Incrementation du compteur de partage
 */
router.post('/count', auth(), (req, res) => {
  ShareController.updateShareCount(req.body.candidatId, req.body.type)
    .then(() => {
      res.status(200).json();
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : get /api/<VERSION>/cv/shares
 * Description : récupère total de partage
 */
router.get('/shares', auth(), (req, res) => {
  ShareController.getTotalShares()
    .then((total) => {
      res.status(200).json({ total });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv
 * Description :  Récupère le CV lié au userId passé en query
 */
router.get('/', auth(), (req, res) => {
  const { userId } = req.query;
  CVController.getCVbyUserId(userId)
    .then((listeCVs) => {
      /* console.log(`${infoLog} Liste des CV trouvés`);
      console.log(listeCVs); */
      res.status(200).json(listeCVs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv/edit
 * Description : Récupère le CV associé au <USERID> fournit en body
 */

/*
  router.get('/edit', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    checkUserAuthorization(req, res, req.params.id, () => {
      let userId;
      if (req.payload.role === USER_ROLES.CANDIDAT) {
        userId = req.payload.id;
      } else if (req.payload.candidatId) {
        userId = req.payload.candidatId;
      }
      if (!userId) {
        console.log(`Aucun userId trouvé, aucun CV ne peut être récupéré`);
        res.status(401).send('Aucun userId trouvé, aucun CV ne peut être récupéré');
      } else {
        CVController.getCVbyUserId(userId)
          .then((cv) => {
            if (cv !== null) {
              console.log(`CV trouvé`);
            } else {
              console.log(`Aucun CV trouvé`);
            }
            res.status(200).json(cv);
          })
          .catch((err) => {
            console.log(err);
            res.status(401).send(`Aucun CV trouvé`);
          });
      }
    });
  });
*/


/**
 * Route : GET /api/<VERSION>/cv/cards/random
 * Description : Retourne <nb> CV(s) pour des cartes de manière aléatoire
 * Paramètre :
 * - nb : Nombre de CVs à retourner (11 par défaut)
 * Exemple : <server_url>/api/v1/cv/cards/random?nb=2
 */
router.get('/cards/random', auth(), (req, res) => {
  CVController.getRandomShortCVs(req.query.nb, req.query.q)
    .then((listeCVs) => {
      res.status(200).json(listeCVs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv/<URL>
 * Description : Récupère le CV associé à l'<URL> fournit
 */
router.get('/:url', auth(), (req, res) => {
  CVController.getCVbyUrl(req.params.url)
    .then((cv) => {
      if (cv) {
        console.log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        console.log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err);
    });
});

/**
 * Route : PUT /api/<VERSION>/cv/<ID>
 * Description : Modifie le CV associé à l'<ID> fournit
 */

/*
  router.put('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    checkUserAuthorization(req, res, req.body.UserId, () => {
      CVController.setCV(req.params.id, req.body)
      .then((cv) => {
        console.log(`CV modifié`);
        res.status(200).json(cv);
      })
      .catch((err) => {
        console.log(`Une erreur est survenue`);
        res.status(400).send(err);
      });
    });
  });
*/

/*
  router.post('/image', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    CVController.uploadToBucket(req.body.file, req.payload.id)
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.error(err);
        res.status(401).send('Une erreur est survenue');
      });
  });
*/

/**
 * Route : DELETE /api/<VERSION>/cv/<ID>
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', auth([USER_ROLES.ADMIN]), (req, res) => {
  CVController.deleteCV(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

module.exports = router;
