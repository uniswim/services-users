import { Ability, RawRule } from "@casl/ability"
import Utilisateur from "./../database/models/Utilisateur";
import database from "@database/*";
import { Linq } from "./index";
const getByPath = require('lodash.get');

const parseJSON = (template: string, variables: {[key: string]: any}) => {
    return JSON.parse(template, (key, rawValue) => {
        if(rawValue[0] !== '$'){
            return rawValue;
        }
        const name = rawValue.slice(2, -1);
        const value = getByPath(variables, name);

        if(typeof value === 'undefined'){
            throw new ReferenceError(`Variable ${name} is not defined`);
        }

        return value;
    });
}

export const defineAbilitiesForUser = async (user: Utilisateur) => {
    let template = "[]";
    let _rules: RawRule[] = [];
    let _abilites = await database.repos.abilite.getAbilitesFromUtilisateur(user);
    Linq.from(_abilites).forEach(abilite => {
        let __rules = parseJSON(abilite.template, { user }) as RawRule[];
        Linq.from(__rules).forEach(x => _rules.push(x));
    });    
    return new Ability(_rules);
}