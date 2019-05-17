import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, PrimaryKey } from "sequelize-typescript"
import Abilite from "./Abilite";
import Utilisateur from "./Utilisateur";

@Table({ tableName: "utilisateur_abilite" })
export default class UtilisateurAbilite extends Model<UtilisateurAbilite>{
    @ForeignKey(() => Utilisateur)
    @Column
    utilisateur_id: number;

    @ForeignKey(() => Abilite)
    @Column
    abilite_id: number;
}

