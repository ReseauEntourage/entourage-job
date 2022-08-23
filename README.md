# LinkedOut Backend

## Modules principaux & versions

> Node 14.x.x

> Express 4.17.2

> Sequelize 6.12.2

> ESLint 7.32.0

> Babel 7.16.5

## Architecture

- `.github`: configuration de la CI avec __*Github Actions*__
- `.husky` : scripts de hook de commit avec __*Husky*__
- `/public` : stockage des ressources non dynamique accessible publiquement
- `/src`
  - `/constants` : fichiers de constantes
  - `/controllers` : logiques métier de chaque use case de l'application
  - `/helpers` : fichier d'utilitaire lié aux use cases
  - `/jobs` : configuration des jobs asynchrones et gestions des jobs entrants
  - `/routes` : configuration des routes avec **Express.js**
    - `/db` : configuration de la base de données avec **Sequelize**
      - `/config` : configuration d'accès à la base de données
      - `/migrations`: fichiers de migration de la structure de la base
      - `/models` : fichiers modèles des objets en base
  - `/utils` : fonctions utilitaires communes
  - `app.js`: point d'entrée de lancement du serveur
  - `mainWorker.js`: point d'entrée de lancement du worker
  - `server.js`: gestion du serveur
- `.babelrc` : configuration pour __*Babel*__
- `.editorconfig` : configuration par défaut de la syntaxe du code de l'éditeur
- `.env` : à ajouter pour gérer les variables d'environnements ([cf. exemple](#fichier-env-minimal))
- `.eslintignore` : configuration pour __*ESLint*__
- `.eslintrc.json` : configuration pour __*ESLint*__
- `.prettierignore` : configuration pour __*Prettier*__
- `.prettierrc.json` : configuration pour __*Prettier*__
- `.sequelizerc` : configuration pour **Sequelize**
- `.slugignore` : dossiers ou fichiers à exclure du package finale pendant la compilation
- `Procfile` : configuration des process __*Heroku*__ à lancer après déploiement


## Configuration

### Pré-requis

Pour lancer le projet vous avez besoin de **Docker** ainsi que de **NodeJs**.

### Installation des modules

```
npm install
```

### Initialisation de la BDD

```
docker run --name entourage-db -e POSTGRES_PASSWORD=entourage -e POSTGRES_USER=entourage -d -p 5432:5432 postgres
```

Vous avez besoin des données du fichier `.env` et de renseigner le champs *DATABASE_URL* (*ex:* `postgresql://entourage:entourage@localhost:5432/entourage`) avec l'adresse de l'instance __*Docker*__.

```
npx sequelize db:create
```

```
npx sequelize db:migrate
```

### Lancer le projet en mode développement

```
npm run dev
```

### Lancer le projet en mode production
```
npm run build
npm start
```

### Lancement du worker

#### Mode développement
```
npm run dev-mainWorker
```

#### Mode production
```
npm run mainWorker
```

### Prettier + Linter
```
npm run lint
npm run format
```
Ces deux commandes sont lancées par les hooks de commit.

### Fichier `.env` minimal

```.dotenv
ACTIONS_REMINDER_DELAY=
ADMIN_CANDIDATES_HZ=
ADMIN_CANDIDATES_LILLE=
ADMIN_CANDIDATES_LYON=
ADMIN_CANDIDATES_PARIS=
ADMIN_COMPANIES_HZ=
ADMIN_COMPANIES_LILLE=
ADMIN_COMPANIES_LYON=
ADMIN_COMPANIES_PARIS=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_OFFERS=
AUTO_RECOMMENDATIONS_ZONE=
AWS_LAMBA_URL=
AWSS3_BUCKET_NAME=
AWSS3_FILE_DIRECTORY=
AWSS3_ID=
AWSS3_IMAGE_DIRECTORY=
AWSS3_SECRET=
BITLY_TOKEN=
CDN_ID=
CHROME_PATH=
CV_10_REMINDER_DELAY=
CV_20_REMINDER_DELAY=
CV_START_DELAY=
DATABASE_URL=
EXTERNAL_OFFERS_REMINDER_DELAY=
FRONT_URL=
INTERVIEW_TRAINING_REMINDER_DELAY=
JWT_SECRET=
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
MAILJET_CONTACT_EMAIL=
MAILJET_FROM_EMAIL=
MAILJET_FROM_NAME=
MAILJET_PUB=
MAILJET_SEC=
MAILJET_SMS_TOKEN=
MAILJET_SUPPORT_EMAIL=
OFFER_NO_RESPONSE_DELAY=
OFFER_REMINDER_DELAY=
PORT=
PUSHER_API_KEY=
PUSHER_API_SECRET=
PUSHER_APP_ID=
PUSHER_URL=
REDIS_TLS_URL=
REDIS_URL=
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_LOGIN_URL=
SALESFORCE_PASSWORD=
SALESFORCE_REDIRECT_URI=
SALESFORCE_SECURITY_TOKEN=
SALESFORCE_USERNAME=
SENTRY_DSN=
SERVER_TIMEOUT=
USE_MAILJET_SMS=
USE_SMS=
VIDEO_REMINDER_DELAY=
VONAGE_API_KEY=
VONAGE_API_SECRET=
```

## Tests

### Initialisation de la BDD de test

```
docker run --name entourage-db-test -e POSTGRES_PASSWORD=entourage -e POSTGRES_USER=entourage -d -p 54300:5432 postgres
```

Vous avez besoin des données du fichier **`.env.test`** pour les tests en local, et de renseigner le champs *DATABASE_URL* (`ex: postgresql://entourage:entourage@localhost:54300/entourage-db-test`) avec l'adresse de l'instance __*Docker*__

```
NODE_ENV=dev-test npx sequelize db:migrate
```

### Lancer les tests

- `npm run test` est utilisé pour l'intégration continue pour lancer les tests avec les valeurs du fichier `.env`
- `npm run dev-test` pour lancer les tests en local, en utilisant le fichier `.env.test`

## Déploiement

Le déploiement se fait automatiquement grâce à __*Github Actions*__ et __*Heroku*__.

Si un commit est poussé sur `develop`, l'application sera déployé sur la pre-production : **[https://entourage-job-preprod.herokuapp.com](https://entourage-job-preprod.herokuapp.com)**

Si un commit est poussé sur `master`,  l'application sera déployé sur la production : **[https://api.linkedout.fr](https://api.linkedout.fr)**

Les tests sont effectués sur __*Github Actions*__ avant de déployer le projet sur __*Heroku*__.

## Stack technique

![Stack technique LinkedOut](./stack.svg)
