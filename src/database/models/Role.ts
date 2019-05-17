import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import Application from "./Application";
import Abilite from "./Abilite";
import RoleAbilite from "./RoleAbilite";

@Table
export default class Role extends Model<Role> {

    @ForeignKey(() => Application)
    @Column
    application_id: number;

    @Column
    nom: string;

    @Column
    description: string;

    @BelongsTo(() => Application)
    application: Application

    @BelongsToMany(() => Abilite, () => RoleAbilite)
    abilites: Abilite[]
}
