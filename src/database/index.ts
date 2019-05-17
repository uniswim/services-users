// DOCUMENTATIONS
// https://github.com/RobinBuschmann/sequelize-typescript

import { Sequelize } from "sequelize-typescript"
import config from "@config/*";
import Abilite from "./models/Abilite";
import Application from "./models/Application";
import Client from "./models/Client";
import Contact from "./models/Contact";
import Role from "./models/Role";
import Utilisateur from "./models/Utilisateur";
import ClientApplication from "./models/ClientApplication";
import RoleAbilite from "./models/RoleAbilite";
import UtilisateurAbilite from "./models/UtilisateurAbilite";
import UtilisateurRole from "./models/UtilisateurRole";
import ResetPasswordToken from "./models/ResetPasswordToken";
import repositories from "./repositories/index";
import ClientUtilisateur from "./models/ClientUtilisateur";



const sequelize = new Sequelize({
    ...config.bdd,
});

sequelize.addModels([ 
    Contact, Client, Application, Abilite, Role, 
    Utilisateur, ClientApplication, RoleAbilite, 
    UtilisateurAbilite, UtilisateurRole,
    ResetPasswordToken, ClientUtilisateur
]);


const models = {
    Client, Contact, Application, Abilite, Role, Utilisateur, ResetPasswordToken
}

export default {
    bdd: sequelize,
    models: models,
    repos: repositories
}
