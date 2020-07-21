# Entourage Job

##Architecture en place

- _.next_ : **Next.js**
- _api_ : Contrôleurs côté serveur (routes API) **Express.js** et **Sequelize**
  - _v1_ : Versionning de l'API
- _assets_ : **@Johann a détailler**
- _components_ : Dossier contenant les components **React** écrit avec les particularités de **Next.js**.
- _custom_ : Thème less **uikit** customisé pour Entourage (Déposé ici seulement pour sauvegarde; non utilisé directement).
- _db_ : Tout ce qui concerne la base de données (Partie **Sequelize**)
  - _config_ : Configuration d'accès à la base de données.
  - _migrations_ : Fichiers de migration de la structure de la base.
  - _models_ : Fichiers modèles des objets en base.
  - _seeders_ : Fichiers d'ajout de données dans la base.
- _pages_ : Dossier contenant les components **React** de rendu de pages.
  -_app.js_ : Permet la customisation du component parent général. (Navbar présente sur tout le site par exemple).
  - _document.js_ : Permet la customisation du document HTML. (Inclusion des scripts JS de UiKit par exemple).
- _static_ : Stockage des éléments non dynamique tels que les images ou la partie CSS.
- _test_ : Dédiés au tests. Utilisation de **Mocha**.
- _.editorconfig_ : **@Johann a détailler**
- _.env_ : A ajouter pour gérer les variables d'environnements (**dotenv**)
- _.eslintignore_ : Configuration pour **ESLint**
- _.eslintrc.json_ : Configuration pour **ESLint**
- _.prettierignore_ : Configuration pour **Prettier**
- _.prettierrc.json_ : Configuration pour **Prettier**
- _.sequelizerc_ : Configuration pour **Sequelize**
- _.travis.yml_ : Configuration de **Travis CI** (Changement de clé encrypt à effectuer pour Entourage. Voir [la documentation](https://docs.travis-ci.com/user/deployment/heroku/)
- _app.json_ : Fichier de configuration d'**Heroku** (Permet d'indiquer des variables d'environnement)
- _Axios.js_ : Configuration **Axios** pour communiquer facilement avec le serveur.
- _next.config.js_ : Fichier de configuration pour **Next.js**
- _serveur-express.js_ : Partie **Express.js**

## Setup

### Initier et démarrer le projet en local

## 1# Prérequis

Pour lancer le projet vous avez besoin de **Docker** ainsi que de **NodeJs**.

## 2# Initialisation de le BDD

- `docker run --name entourage-db -e POSTGRES_PASSWORD=entourage -d -p 5432:5432 postgres`

- Vous avez besoin des données du fichier **`.env`** et de renseigner le champs DATABASE_URL (`ex: postgresql://entourage:entourage@localhost:5432/entourag`) avec votre adresse.

- `npx sequelize db:create`

- `npx sequelize db:migrate`

- `npx sequelize db:seed:all`

## 3# Insertion des données dans la BDD

Il vous faut installer l'interface PostgreSQL **`psql`** pour votre OS.

- Insérez les données présentes dans le fichier qui se trouve dans **/migrations** grâce à la commande suivante: `psql -h localhost -d entourage -U entourage -f ./migrations/local-2020_07_08_17_16_25-dump.sql`

## 4# Lancer le projet en mode développement

- `npm run dev`

### You are all set !