import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, PrimaryKey } from "sequelize-typescript"
import Role from "./Role";
import Utilisateur from "./Utilisateur";


@Table({ tableName: "utilisateur_role" })
export default class UtilisateurRole extends Model<UtilisateurRole>{
    @ForeignKey(() => Utilisateur)
    @Column
    utilisateur_id: number;

    @ForeignKey(() => Role)
    @Column
    role_id: number;
}
