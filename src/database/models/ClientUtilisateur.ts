import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, HasMany, Length, BeforeCreate } from "sequelize-typescript"
import Client  from "./Client";
import Utilisateur from "./Utilisateur";


@Table({ tableName: "client_utilisateur" })
export default class ClientUtilisateur extends Model<ClientUtilisateur>
{
    @ForeignKey(() => Client)
    @Column
    client_id: number

    @ForeignKey(() => Utilisateur)
    @Column
    utilisateur_id: number
}
