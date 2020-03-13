// eslint-disable-next-line import/newline-after-import
const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { auth } = require('../../../controllers/Auth');
const UserController = require('../../../controllers/User');
const CVController = require('../../../controllers/CV');
const S3 = require('../../../controllers/aws');
const { sendMail } = require('../../../controllers/mail');
const createPreviewImage = require('../../../shareImage');

const upload = multer({ dest: 'uploads/' });

/**
 * Route : POST /api/<VERSION>/cv
 * Description : Créé le CV
 */
router.post(
  '/',
  auth.required,
  upload.single('profileImage'),
  async (req, res) => {
    // si le cv est une string json le parser, sinon prendre l'objet
    const reqCV =
      typeof req.body.cv === 'string' ? JSON.parse(req.body.cv) : req.body.cv;

    switch (req.payload.role) {
      case 'Candidat':
        reqCV.status = 'Pending';
        break;
      case 'Coach':
      case 'Admin':
        // on laisse la permission au coach et à l'admin de choisir le statut à enregistrer
        if (!reqCV.status) {
          reqCV.status = 'Published';
        }
        break;
      default:
        reqCV.status = 'Unknown';
        break;
    }
    // uploading image and generating preview image
    if (req.file) {
      const { path } = req.file;
      try {
        const fileBuffer = await sharp(path)
          .trim()
          .webp()
          .toBuffer();
        reqCV.urlImg = await S3.upload(
          fileBuffer,
          `${reqCV.UserId}.${reqCV.status}.webp`
        );
      } catch (error) {
        console.error(error);
      } finally {
        fs.unlinkSync(path); // remove image localy after upload to S3
      }
    }

    if (reqCV.status === 'Published') {
      try {
        const { Body } = await S3.download(reqCV.urlImg);
        reqCV.urlImg = await S3.upload(Body, `${reqCV.UserId}.Published.webp`);
      } catch (error) {
        console.error(error);
      }
    }

    UserController.getUser(reqCV.UserId).then((user) => {
      // Génération de la photo de preview
      S3.download(reqCV.urlImg)
        .then(({ Body }) =>
          createPreviewImage({
            input: Body,
            name: user.firstName.toUpperCase(),
            description:
              reqCV.catchphrase ||
              'EN GALÈRE, CHERCHE UN JOB POUR S’EN SORTIR.',
            ambition:
              reqCV.ambitions && reqCV.ambitions.length > 0
                ? reqCV.ambitions
                    .slice(0, 2)
                    .map((ambition) => ambition.toUpperCase())
                    .join('. ')
                : 'OUVERT À TOUTES PROPOSITIONS',
          })
            .jpeg()
            .toBuffer()
        )
        .then((buffer) =>
          S3.upload(buffer, `${reqCV.UserId}.${reqCV.status}.preview.jpg`)
        )
        .then((previewUrl) => console.log('preview uploaded: ', previewUrl))
        .catch(console.error);
    });

    try {
      // création du corps du CV
      const cv = await CVController.createCV(reqCV);
      // notification mail to coach and admin
      if (req.payload.role === 'Candidat') {
        const mailSubject = 'Soumission CV';
        const mailText = `Bonjour,\n\n${req.payload.firstName} vient de soumettre son CV.\nRendez-vous dans votre espace personnel pour le relire et vérifier les différents champs. Lorsque vous l'aurez validé, il sera mis en ligne.\n\nMerci de veiller tout particulièrement à la longueur des descriptions des expériences, à la cohérence des dates et aux fautes d'orthographe !\n\nL'équipe Entourage.`;
        // notification de l'admin
        sendMail({
          toEmail: process.env.MAILJET_TO_EMAIL,
          subject: mailSubject,
          text: mailText,
        });
        // Récupération de l'email du coach pour l'envoie du mail
        UserController.getUser(req.payload.userToCoach)
          .then(({ email }) =>
            sendMail({ toEmail: email, subject: mailSubject, text: mailText })
          )
          .catch((err) => console.log('Pas de coach rattaché au candidat'));
      }
      return res.status(200).json(cv);
    } catch (err) {
      console.log(err);
      return res.status(401).send(`Une erreur est survenue`);
    }
  }
);

/**
 * Route : GET /api/<VERSION>/cv
 * Description : Récupère tous les CVs complets
 */
router.get('/', (req, res) => {
  console.log(req.query);

  (req.query.userId
    ? CVController.getCVbyUserId(req.query.userId)
    : CVController.getCVs()
  ) // todo bizare getCVs
    .then((listeCVs) => {
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
router.get('/edit', auth.required, (req, res) => {
  console.log(req.payload);
  let userId;
  if (req.payload.role === 'Candidat') {
    userId = req.payload.id;
  } else if (req.payload.userToCoach) {
    userId = req.payload.userToCoach;
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

/**
 * Route : GET /api/<VERSION>/cv/cards/random
 * Description : Retourne <nb> CV(s) pour des cartes de manière aléatoire
 * Paramètre :
 * - nb : Nombre de CVs à retourner (11 par défaut)
 * Exemple : <server_url>/api/v1/cv/cards/random?nb=2
 */
router.get('/cards/random', (req, res) => {
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
router.get('/:url', (req, res) => {
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
router.put('/:id', (req, res) => {
  CVController.setCV(req.params.id, req.body)
    .then((cv) => {
      console.log(`CV modifié`);
      res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
});

router.post('/image', auth.required, (req, res) => {
  CVController.uploadToBucket(req.body.file, req.payload.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : DELETE /api/<VERSION>/cv/<ID>
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', (req, res) => {
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
