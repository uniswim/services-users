import Utilisateur from "../models/Utilisateur";
import Abilite from "../models/Abilite";
import Role from "../models/Role";
import { Linq } from "@utils/*";

export const getAbilitesFromUtilisateur = async (user: Utilisateur) => {

    let _abilites: Abilite[] = [];
    let _roles = await user.$get<Role>("roles",{ include: [ Abilite ] }) as Role[];
    Linq.from(_roles).forEach(role => {
        if(role.abilites){
            Linq.from(role.abilites).forEach(abilite => _abilites.push(abilite));
        }
    })
    let _bddAbilites = await user.$get<Abilite>("abilites") as Abilite[];
    Linq.from(_bddAbilites).forEach(x => _abilites.push(x));

    return _abilites;
}