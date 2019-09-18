# Entourage Job

Architecture en place :

- _.next_ : **Next.js**
- _components_ : Dossier contenant les components **React** écrit avec les particularités de **Next.js**.
- _pages_ : Dossier contenant les components **React** de rendu de pages.
- _pages/\_app.js_ : Permet la customisation du component parent général. (Navbar présente sur tout le site par exemple).
- _pages/\_document.js_ : Permet la customisation du document HTML. (Inclusion des scripts JS de UiKit par exemple).
- _test_ : Dédiés au tests. Utilisation de **Mocha**.
- _.env_ : A ajouter pour gérer les variables d'environnements (**dotenv**)
- _.travis.yml_ : Configuration de **Travis CI** (Changement de clé encrypt à effectuer pour Entourage. Voir [la documentation](https://docs.travis-ci.com/user/deployment/heroku/)
- _app.json_ : Fichier de configuration d'**Heroku** (Permet d'indiquer des variables d'environnement)
- _srv-express.js_ : Partie **Express.js**



Pour la base de données :
- Si elle n'existe pas : sequelize db:create
- Migrations de la structure : sequelize db:migrate:all
- Intégration de données de test : sequelize db:seed:all