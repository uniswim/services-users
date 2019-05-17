import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, PrimaryKey, Length, BeforeCreate, BeforeUpdate } from "sequelize-typescript"
import Application from "./Application";
import Role from "./Role";
import Abilite from "./Abilite";
import UtilisateurAbilite from "./UtilisateurAbilite";
import UtilisateurRole from "./UtilisateurRole";
import Client from "./Client";
import ClientUtilisateur from "./ClientUtilisateur";

@Table
export default class Utilisateur extends Model<Utilisateur> {

    @Length({max:255})
    @Column
    password: string;

    /*@BeforeCreate
    static async hashPassword(instance: Utilisateur){
        let textCrypted = await CryptText(instance.password);
        instance.password = textCrypted;
    }*/

    @Column
    nom: string;

    @Column
    prenom: string;

    @Column({ unique: true })
    email: string;

    @BelongsToMany(() => Abilite, () => UtilisateurAbilite)
    abilites: Abilite[]

    @BelongsToMany(() => Role, () => UtilisateurRole)
    roles: Role[]

    @BelongsToMany(() => Client, () => ClientUtilisateur)
    clients: Client[]
}

