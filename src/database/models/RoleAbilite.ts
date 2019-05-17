import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import Abilite from "./Abilite";
import Role from "./Role";


@Table({ tableName: "role_abilite" })
export default class RoleAbilite extends Model<RoleAbilite>
{
    @ForeignKey(() => Role)
    @Column
    role_id: number

    @ForeignKey(() => Abilite)
    @Column
    abilite_id: number
}