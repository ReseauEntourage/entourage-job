const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const puppeteer = require('puppeteer');
const PDFMerger = require('pdf-merger-js');

const RedisManager = require('../../../utils/RedisManager');
const { auth } = require('../../../controllers/Auth');
const UserController = require('../../../controllers/User');
const CVController = require('../../../controllers/CV');
const ShareController = require('../../../controllers/Share');
const S3 = require('../../../controllers/aws');
const { sendMail } = require('../../../controllers/mail');
const { airtable } = require('../../../controllers/airtable');
const createPreviewImage = require('../../../shareImage');
const { USER_ROLES, CV_STATUS, NEWSLETTER_ORIGINS, REDIS_KEYS } = require('../../../../constants');
const { checkCandidatOrCoachAuthorization } = require('../../../utils');

const upload = multer({ dest: 'uploads/' });

// sharp.cache(false);

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

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
    const reqCV =
      typeof req.body.cv === 'string' ? JSON.parse(req.body.cv) : req.body.cv;
    const autoSave = req.body && req.body.autoSave;
    checkCandidatOrCoachAuthorization(req, res, reqCV.UserId, async () => {
      switch (req.payload.role) {
        case USER_ROLES.CANDIDAT:
          reqCV.status = CV_STATUS.Progress.value;
          break;
        case USER_ROLES.COACH:
          if (
            reqCV.status !== CV_STATUS.Progress.value &&
            reqCV.status !== CV_STATUS.Pending.value
          ) {
            reqCV.status = CV_STATUS.Progress.value;
          }
          break;
        case USER_ROLES.ADMIN:
          // on laisse la permission à l'admin de choisir le statut à enregistrer
          if (!reqCV.status) {
            reqCV.status = CV_STATUS.Published.value;
          }
          break;
        default:
          reqCV.status = CV_STATUS.Unknown.value;
          break;
      }

      const processImage = async () => {
        if (autoSave) {
          return;
        }

        const ratio = 2.1;
        const imageWidth = Math.trunc(520 * ratio);
        const imageHeight = Math.trunc(272 * ratio);

        const generatePreviewImage = (url) => {
          return new Promise((resolve, reject) => {
            UserController.getUser(reqCV.UserId)
              .then(({ firstName, gender }) =>
                // Génération de la photo de preview
                S3.download(url)
                  .then(async ({ Body }) =>
                    createPreviewImage(
                      imageWidth,
                      imageHeight,
                      Body,
                      firstName,
                      reqCV.catchphrase,
                      reqCV.ambitions,
                      reqCV.skills,
                      reqCV.locations,
                      gender
                    )
                  )
                  .then((sharpData) =>
                    sharpData.jpeg({ quality: 75 }).toBuffer()
                  )
                  .then((buffer) =>
                    S3.upload(
                      buffer,
                      'image/jpeg',
                      `${reqCV.UserId}.${reqCV.status}.preview.jpg`
                    )
                  )
                  .then((previewUrl) => {
                    console.log('preview uploaded: ', previewUrl);
                    resolve(previewUrl);
                  })
                  .catch((err) => {
                    console.error(err);
                    reject(err);
                  })
              )
              .catch((err) => {
                console.error(err);
                reject(err);
              });
          });
        };

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

            /*
             TO KEEP If ever we want to pre-resize the preview background image

             const previewBuffer = await sharp(fileBuffer)
                .trim()
                .resize(imageWidth, imageHeight, {
                  fit: 'cover',
                })
                .jpeg({quality: 75})
                .toBuffer();

              await S3.upload(
                previewBuffer,
                'image/jpeg',
                `${reqCV.UserId}.${reqCV.status}.small.jpg`
              );
          */
          } catch (error) {
            console.error(error);
          } finally {
            if (fs.existsSync(path)) fs.unlinkSync(path); // remove image localy after upload to S3
          }
        } else if (reqCV.urlImg) {
          try {
            const { Body } = await S3.download(reqCV.urlImg);
            reqCV.urlImg = await S3.upload(
              Body,
              'image/jpeg',
              `${reqCV.UserId}.${reqCV.status}.jpg`
            );

            /*
              TO KEEP If ever we want to pre-resize the preview background image

              const {Body} = await S3.download(reqCV.urlImg);
              await S3.upload(s3image.Body, 'image/jpeg', `${reqCV.UserId}.${reqCV.status}.small.jpg`);
            */

            // TODO use when we make it work
            // reqCV.urlImg = await S3.copy(reqCV.urlImg, `${reqCV.UserId}.${reqCV.status}.jpg`);
          } catch (error) {
            console.error(error);
          }
        }
        if (reqCV.urlImg) {
          try {
            await generatePreviewImage(
              reqCV.urlImg /* .replace('.jpg', '.small.jpg') */
            );
          } catch (error) {
            console.log(error);
          }
        }
      };

      const createCVAndSendMail = async () => {
        if (!autoSave && (reqCV.urlImg || req.file)) {
          reqCV.urlImg = `images/${reqCV.UserId}.${reqCV.status}.jpg`;
        }

        // création du corps du CV
        const cv = await CVController.createCV(reqCV);

        try {
          // notification mail to coach and admin
          if (
            req.payload.role === USER_ROLES.COACH &&
            reqCV.status === CV_STATUS.Pending.value
          ) {
            const mailSubject = 'Soumission CV';
            const mailText = `Bonjour,\n\n${req.payload.firstName} vient de soumettre le CV de son candidat.\nRendez-vous dans votre espace personnel pour le relire et vérifier les différents champs. Lorsque vous l'aurez validé, il sera mis en ligne.\n\nMerci de veiller tout particulièrement à la longueur des descriptions des expériences, à la cohérence des dates et aux fautes d'orthographe !\n\nL'équipe Entourage.`;
            // notification de l'admin
            await sendMail({
              toEmail: process.env.MAILJET_TO_EMAIL,
              subject: mailSubject,
              text: mailText,
            });
          }
        } catch (e) {
          console.log(e);
        }
        return cv;
      };

      const promises = [processImage, createCVAndSendMail];

      Promise.all(promises.map(async (promise) => promise()))
        .then(async (results) => {
          if (reqCV.status === CV_STATUS.Published.value) {
            try {
              await S3.deleteFile(
                `${process.env.AWSS3_FILE_DIRECTORY}${results[1].user.url}.pdf`
              );
              await RedisManager.delAsync(REDIS_KEYS.CV_LIST);
            } catch (err) {
              console.log(err);
            }
          }
          return res.status(200).json(results[1]);
        })
        .catch((e) => {
          console.log(e);
          return res.status(401).send(`Une erreur est survenue`);
        });
    });
  }
);

/**
 * Route : POST /api/<VERSION>/cv
 * Description : Prise d'info partageur
 */
router.post('/share', auth(), (req, res) => {
  return airtable('Newsletter').create(
    [
      {
        fields: {
          email: req.body.email,
          Origine: req.body.origin || NEWSLETTER_ORIGINS.LKO,
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
    .then((cv) => {
      if (cv && !isEmpty(cv)) {
        console.log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        console.log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
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
      if (cv && !isEmpty(cv)) {
        console.log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        console.log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv/pdf/<URL>
 * Description : Récupère le CV en PDF associé à l'<URL> fournit
 */
router.get('/pdf/:url', auth(), async (req, res) => {
  const paths = [
    `${req.params.url}-page1.pdf`,
    `${req.params.url}-page2.pdf`,
    `${req.params.url}.pdf`,
  ];

  let pdfBuffer = null;

  try {
    const file = await S3.download(
      `${process.env.AWSS3_FILE_DIRECTORY}${paths[2]}`
    );
    pdfBuffer = file.Body;
  } catch (e) {
    console.log("PDF version doesn't exist.");
  }

  try {
    if (!pdfBuffer) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      const merger = new PDFMerger();

      const options = { content: '@page { size: A4 portrait; margin: 0; }' };

      // Fix because can't create page break
      await page.goto(
        `${process.env.SERVER_URL}/cv/pdf/${req.params.url}?page=0`,
        { waitUntil: 'networkidle2' }
      );
      await page.addStyleTag(options);
      await page.emulateMediaType('screen');
      await page.pdf({
        path: paths[0],
        preferCSSPageSize: true,
        printBackground: true,
      });
      merger.add(paths[0]);

      await page.goto(
        `${process.env.SERVER_URL}/cv/pdf/${req.params.url}?page=1`,
        { waitUntil: 'networkidle2' }
      );
      await page.addStyleTag(options);
      await page.emulateMediaType('screen');
      await page.pdf({
        path: paths[1],
        preferCSSPageSize: true,
        printBackground: true,
      });
      merger.add(paths[1]);

      await browser.close();

      await merger.save(paths[2]);

      pdfBuffer = fs.readFileSync(paths[2]);

      await S3.upload(pdfBuffer, 'application/pdf', `${paths[2]}`);
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(401).send('Une erreur est survenue');
  } finally {
    if (fs.existsSync(paths[0])) fs.unlinkSync(paths[0]);
    if (fs.existsSync(paths[1])) fs.unlinkSync(paths[1]);
    if (fs.existsSync(paths[2])) fs.unlinkSync(paths[2]);
  }
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
