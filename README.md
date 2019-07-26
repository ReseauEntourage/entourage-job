# Entourage Job
Architecture en place :

- *.next* : **Next.js**
- *components* : Dossier contenant les components **React** écrit avec les particularités de **Next.js**.
- *pages* : Dossier contenant les components **React** de rendu de pages.
- *pages/_app.js : Permet la customisation du component parent général. (Navbar présente sur tout le site par exemple).
- *pages/_document.js : Permet la customisation du document HTML. (Inclusion des scripts JS de UiKit par exemple).
- *test* : Dédiés au tests. Utilisation de **Mocha**.
- *.env* : A ajouter pour gérer les variables d'environnements (**dotenv**)
- *.travis.yml* : Configuration de **Travis CI** (Changement de clé encrypt à effectuer pour Entourage. Voir [la documentation](https://docs.travis-ci.com/user/deployment/heroku/)
- *app.json* : Fichier de configuration d'**Heroku** (Permet d'indiquer des variables d'environnement)
- *srv-express.js* : Partie **Express.js**