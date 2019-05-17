import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, HasMany, Length, BeforeCreate } from "sequelize-typescript"
import Application from "./Application";
import Client  from "./Client";


@Table({ tableName: "client_application" })
export default class ClientApplication extends Model<ClientApplication>
{
    @ForeignKey(() => Client)
    @Column
    client_id: number

    @ForeignKey(() => Application)
    @Column
    application_id: number
}
