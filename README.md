# Entourage Job
Architecture en place :

- *.next* : **Next.js**
- *components* : Dossier contenant les components **React** écrit avec les particularités de **Next.js**.
- *pages* : Dossier contenant les components **React** de rendu de pages.
- *test* : Dédiés au tests. Utilisation de **Mocha**.
- *.env* : A ajouter pour gérer les variables d'environnements (**dotenv**)
- *.travis.yml* : Configuration de **Travis CI** (Changement de clé encrypt à effectuer pour Entourage. Voir [la documentation](https://docs.travis-ci.com/user/deployment/heroku/)
- *app.json* : Fichier de configuration d'**Heroku** (Permet d'indiquer des variables d'environnement)
- *srv-express.js* : Partie **Express.js**