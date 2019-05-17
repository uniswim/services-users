import * as Express from "express"
import { ApolloServer, gql, AuthenticationError } from "apollo-server-express"
import config from "@config/*";
import logs from "@logs/*";
import database from "@database/*";
import { Cache } from "@cache/*";

import graphQL, { UserContext, UserContextCache } from "./graphQL";
import * as jwt from "jsonwebtoken"
import { defineAbilitiesForUser } from "./../utils/Abilities";
import { Ability } from "@casl/ability";

import ServerMiddleware from "@uniswim/lib-services-utils/dist/lib/Express/Middlewares/ServerMiddleware"

async function createServer(){
    // -- express Server
    const app = Express();

    // -- configuration
    app.set("port", config.server.port);

    ServerMiddleware.applyMiddleware({
        app,
        cookie: { active: true, secret_key: config.cookie.secret_key },
        cors: { active: true },
        httpLogging: logs.logExpress,
        errorLogging: logs.logExpress
    })

    /*app.use(BodyParser.json());
    app.use(BodyParser.urlencoded({ extended: false }));*/

    // -- connect to database
    await database.bdd.authenticate()
    logs.logExpress.info("Connexion à la base de donnée établie");

    /*// -- cookies
    app.use(cookieParser(config.cookie.secret_key));

    // -- express logging
    app.use(LogHttpRequest)

    // -- securite des entetes
    app.use(Helmet())
    app.disable("x-powered-by");

    // -- allow cors
    app.use((req, res, next) => {
        let _origin = req.get("Origin");
        res.header("Access-Control-Allow-Origin", _origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    })    

    // -- express errors
    app.use(LogErrors);
    app.use(ClientErrorHandler);
    app.use(ErrorHandler);
    */

    // -- graphql Server
    const graphQlServer = new ApolloServer({
        schema: graphQL(),
        //typeDefs: TypeDefs,
        //resolvers: Resolvers,
        debug: true,
        uploads: true,
        context: async (expressContext) => {
            
            let req = expressContext.req as Express.Request;
            let token: string = null;
            let userContext: UserContext = null;

            // -- récupération du token
            // ---- authentification via cookie
            if(req.signedCookies && req.signedCookies[config.cookie.key]){
                token = req.signedCookies[config.cookie.key];
            }
            // ---- authentification via httpheader
            let authHeader = req.header("authorization");
            if(authHeader){
                let _split =authHeader.split(" "); 
                let _type = _split[0];
                switch(_type.toUpperCase()){
                    case "JWT" : 
                        if(_split.length >= 1) token = _split[1];
                        break;
                }
            }


            if(token){
                // -- TEST CACHE ou REQUETE BDD
                let userContextCache = await Cache.get<UserContextCache>(token);
                if(!userContextCache){

                    let userJwt: { id: number } = null;
                    // -- test du token
                    try {
                        userJwt = jwt.verify(token, config.jwt.secret) as { id:number };
                        if(userJwt && !userJwt.id) throw new AuthenticationError("Token de connexion invalide");
                    } catch(err){
                        throw new AuthenticationError("Token de connexion invalide");
                    }
                    let _users = await database.repos.utilisateur.GetUtilisateurs({ id: userJwt.id });
                    if(_users.length == 0) throw new AuthenticationError("Token de connexion invalide");
                    let _user = _users[0];

                    // -- create user context
                    userContext = {
                        id: userJwt.id,
                        token: token,
                        //entity: _user,
                        ability: await defineAbilitiesForUser(_user)
                    };

                    // -- store context in cache
                    let _userContextCache: UserContextCache = {
                        id: userContext.id,
                        token: userContext.token,
                        abilityRules: userContext.ability.rules
                    }
                    Cache.set(token, _userContextCache, 60 * 60);

                } else {
                    // -- create user context from cache
                    userContext = {
                        id: userContextCache.id,
                        token: userContextCache.token,
                        ability: new Ability(userContextCache.abilityRules)
                    }
                }

            }

            return {
                log: logs.logGraphQl,
                models: database.models,
                database: database.bdd,
                repos: database.repos,
                user: userContext
            };
        }
    });
    graphQlServer.applyMiddleware({
        app: app,
        path: "/api/graphql"
    });

    // -- endpoint to control the creation of the cookie
    /*
    app.get('/get', (req, res) => {
        // MAIN CODE HERE :
        const signedCookies = req.signedCookies; // get signed cookies
        console.log('signed-cookies:', signedCookies);  
        const cookies = req.cookies; // get not signed cookies
        console.log('not-signed-cookies:', cookies);
        // or access directly to one cookie by its name :
        const myTestCookie = req.signedCookies.test;
        console.log('our test signed cookie:', myTestCookie);
        res.send('get cookie');
    });
    */

    app.get('/credentialCookie', (req, res) => {

        // -- cookies signés
        const signedCookies = req.signedCookies;
        const token = signedCookies[config.cookie.key];
        if(!token) {
            return res
                .status(401)
                .send("Une authentification est nécessaire")
                .end();
        }

        // -- vérification du token
        try {
            jwt.verify(token, config.jwt.secret);
        } catch(err){
            return res
                .status(401)
                .send("Token invalide")
                .end();
        }

        res.send("OK").end();
    });

   /**
    * Création de cookie à partir d'un token
    * Paramètres d'entrées :
    * - expireInDays    : number (optional)
    * - token           : string
    */
    app.post('/credentialCookie', (req, res) => {

        // -- Récupération des infos
        let expireInDays = req.body.expireInDays || 1
        let token = req.body.token;
        if(!token) {
            return res
                .status(400)
                .send("Aucun token passé en paramètre")
                .end();
            //throw new Error("Aucun token passé en paramètre");
        }

        // -- vérification du token envoyé
        try {
            jwt.verify(token, config.jwt.secret);
        } catch(err){
            return res
                .status(400)
                .send("Token invalide")
                .end();
            //throw new Error("Token invalide");
        }

        // -- création du cookie
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + (expireInDays));

        res.cookie(config.cookie.key, token, {
            expires: currentDate,
            httpOnly: false,             // -- to disable accessing cookie via client side js,
            //secure: true              // -- to force https
            //maxAge: 1000000000,         // -- ttl in ms (remove this option and cookie will die when browser is closed)
            signed: true                // -- if you use the secret with cookieParser
        });
        res.send("OK").end();
    });

    // -- endpoint to destroy the cookie
    app.delete('/credentialCookie',(req, res) => {
        res.cookie(config.cookie.key, "");
        res.send('OK').end();
    });

    // -- ecoute du port
    app.listen(app.get("port"), async () => {
        logs.logExpress.info(`Server listening on port ${app.get('port')}`);
    });

    return app;
}

export default createServer;