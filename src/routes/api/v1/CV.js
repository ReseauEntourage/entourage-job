import { auth, getTokenFromHeaders } from 'src/controllers/Auth';
import * as CVController from 'src/controllers/CV';
import * as ShareController from 'src/controllers/Share';
import * as S3 from 'src/controllers/Aws';

import { addToWorkQueue } from 'src/jobs';
import { logger } from 'src/utils/Logger';
import { checkCandidatOrCoachAuthorization } from 'src/utils';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';

import express from 'express';

import { CV_STATUS, JOBS, MAILJET_TEMPLATES, USER_ROLES } from 'src/constants';
import { getZoneSuffix } from 'src/utils/Finding';
import _ from 'lodash';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const getPDFPaths = (userId, queryFileName) => {
  const fileName = queryFileName
    ? `${queryFileName}_${userId.substring(0, 8)}`
    : userId;

  return [`${userId}-page1.pdf`, `${userId}-page2.pdf`, `${fileName}.pdf`];
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

      const urlImg = `images/${reqCV.UserId}.${reqCV.status}.jpg`;

      let oldImg;

      try {
        if (!autoSave && (reqCV.urlImg || req.file)) {
          oldImg = reqCV.urlImg;
          reqCV.urlImg = urlImg;
        }

        // création du corps du CV
        const cv = await CVController.createCV(reqCV, req.payload.id);

        // notification mail to coach and admin
        if (
          req.payload.role === USER_ROLES.COACH &&
          reqCV.status === CV_STATUS.Pending.value
        ) {
          const adminMail =
            process.env[`ADMIN_CANDIDATES_${getZoneSuffix(req.payload.zone)}`];

          const { token, exp, iat, ...restUserProps } = req.payload;

          // notification de l'admin
          await addToWorkQueue({
            type: JOBS.JOB_TYPES.SEND_MAIL,
            toEmail: adminMail,
            templateId: MAILJET_TEMPLATES.CV_SUBMITTED,
            variables: {
              coach: _.omitBy(restUserProps, _.isNil),
              cv: _.omitBy(cv, _.isNil),
            },
          });
        }

        if (!autoSave) {
          if (reqCV.status === CV_STATUS.Published.value) {
            await addToWorkQueue({
              type: JOBS.JOB_TYPES.CACHE_CV,
              candidatId: reqCV.UserId,
            });
            await addToWorkQueue({
              type: JOBS.JOB_TYPES.CACHE_ALL_CVS,
            });
            await addToWorkQueue({
              type: JOBS.JOB_TYPES.CREATE_CV_SEARCH_STRING,
              candidatId: reqCV.UserId,
            });
          }

          let uploadedImg;

          if (req.file) {
            const { path } = req.file;

            try {
              const fileBuffer = await sharp(path)
                .trim()
                .jpeg({ quality: 75 })
                .toBuffer();

              uploadedImg = await S3.upload(
                fileBuffer,
                'image/jpeg',
                `${cv.UserId}.${cv.status}.jpg`
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
                  `${cv.UserId}.${cv.status}.small.jpg`
                );
              */
            } catch (error) {
              logger(res).error(error);
            } finally {
              if (fs.existsSync(path)) {
                fs.unlinkSync(path); // remove image locally after upload to S3
              }
            }
          }

          await addToWorkQueue({
            type: JOBS.JOB_TYPES.GENERATE_CV_PREVIEW,
            candidatId: reqCV.UserId,
            oldImg,
            uploadedImg,
          });

          const { firstName, lastName } = cv.user.candidat;

          const token = getTokenFromHeaders(req);
          const paths = getPDFPaths(reqCV.UserId, `${firstName}_${lastName}`);
          await addToWorkQueue({
            type: JOBS.JOB_TYPES.GENERATE_CV_PDF,
            candidatId: reqCV.UserId,
            token,
            paths,
          });
        }

        return res.status(200).json(cv);
      } catch (e) {
        logger(res).error(e);
        return res.status(401).send(`Une erreur est survenue`);
      }
    });
  }
);

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
      logger(res).error(err);
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
      logger(res).error(err);
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
        logger(res).log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        logger(res).log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv/checkUpdate
 * Description : Vérifie si des modifications ont étés apportés au CV
 */
router.get(
  '/checkUpdate',
  auth([USER_ROLES.COACH, USER_ROLES.CANDIDAT]),
  (req, res) => {
    let candidatId;
    if (req.payload.role === USER_ROLES.CANDIDAT) {
      candidatId = req.payload.id;
    } else if (req.payload.candidatId) {
      candidatId = req.payload.candidatId;
    }
    CVController.checkCVHasBeenModified(candidatId, req.payload.id)
      .then((cvHasBeenModified) => {
        res.status(200).json(cvHasBeenModified);
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(401).send('Une erreur est survenue');
      });
  }
);

/**
 * Route : PUT /api/<VERSION>/cv/read/<ID>
 * Description : Reset le lastModifiedBy du CV associé à l'<ID> de candidat fournit
 */
router.put(
  '/read/:id',
  auth([USER_ROLES.COACH, USER_ROLES.CANDIDAT]),
  (req, res) => {
    let candidatId;
    if (req.payload.role === USER_ROLES.CANDIDAT) {
      candidatId = req.payload.id;
    } else if (req.payload.candidatId) {
      candidatId = req.payload.candidatId;
    }
    CVController.setCVHasBeenRead(candidatId, req.payload.id)
      .then((cv) => {
        res.status(200).json(cv);
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(401).send('Une erreur est survenue');
      });
  }
);

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
        logger(res).error(`Aucun userId trouvé, aucun CV ne peut être récupéré`);
        res.status(401).send('Aucun userId trouvé, aucun CV ne peut être récupéré');
      } else {
        CVController.getCVbyUserId(userId)
          .then((cv) => {
            if (cv !== null) {
              logger(res).log(`CV trouvé`);
            } else {
              logger(res).log(`Aucun CV trouvé`);
            }
            res.status(200).json(cv);
          })
          .catch((err) => {
            logger(res).error(err);
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
  const { nb, search, ...restParams } = req.query;
  CVController.getRandomShortCVs(nb, search, restParams)
    .then((cvsRes) => {
      res.status(200).json(cvsRes);
    })
    .catch((err) => {
      logger(res).error(err);
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
        logger(res).log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        logger(res).log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/cv/pdf/<URL>
 * Description : Récupère le CV en PDF associé à l'<URL> fournit
 */
router.get(
  '/pdf/:userId',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  async (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.userId, async () => {
      const { userId } = req.params;

      const paths = getPDFPaths(userId, req.query.fileName);

      let pdfUrl = null;
      const s3Key = `${process.env.AWSS3_FILE_DIRECTORY}${paths[2]}`;
      try {
        const pdfExists = await S3.getHead(s3Key);

        if (pdfExists) {
          pdfUrl = await S3.getSignedUrl(s3Key);
        }
      } catch (e) {
        logger(res).log("PDF version doesn't exist.");
      }

      try {
        if (!pdfUrl) {
          const token = getTokenFromHeaders(req);
          pdfUrl = await CVController.generatePdfFromCV(userId, token, paths);
        }

        res.status(200).send({ pdfUrl });
      } catch (err) {
        logger(res).error(err);
        res.status(401).send('Une erreur est survenue');
      }
    });
  }
);

/**
 * Route : PUT /api/<VERSION>/cv/<ID>
 * Description : Modifie le CV associé à l'<ID> fournit
 */

/*
  router.put('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    checkUserAuthorization(req, res, req.body.UserId, () => {
      CVController.setCV(req.params.id, req.body)
      .then((cv) => {
        logger(res).log(`CV modifié`);
        res.status(200).json(cv);
      })
      .catch((err) => {
        logger(res).error(`Une erreur est survenue`);
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
        logger(res).error(err);
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
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

export default router;
