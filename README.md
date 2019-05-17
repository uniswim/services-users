# Service de gestion d'utilisateurs

### Scripts
```
npm run start
```

### Librairies

#### Config
- nconf : permet de charger une configuration de n'importe quelle source (environnement, fichier, ...)
- dotenv : transfére e fichier .env dans les variables d'environnement

#### Log
- winston
- debug
- morgan : middleware logging pour express

#### Dates
- moment

#### Base de données
- mysql2
- sequelize : Orm
- sequelize-typescript : Decorateur pour sequelize

#### Server
- graphql : schema de l'api
- typegql : Décorateurs pour graphql
- express :
- helmet : Protection des entetes http (https://expressjs.com/fr/advanced/best-practice-security.html)

#### Autres
- bcryptjs : cryptage
- jsonwebtoken : JWT Token
- @casl/ability : check permissions -- https://stalniy.github.io/casl/


"passport": "0.4.0",
"reflect-metadata": "0.1.13",
"@dadoudidou/migration": "0.1.4",