import { Table, Column, Model, BelongsToMany, DataType, HasMany, Length, BeforeCreate } from "sequelize-typescript"
import Client  from "./Client";
import Abilite from "./Abilite";
import Role from "./Role";
import * as moment from "moment"
import ClientApplication from "./ClientApplication";

@Table
export default class Application extends Model<Application> {

    @Length({ max: 45 })
    @Column
    nom: string;

    @Column
    date_created_gmt: Date;

    @BeforeCreate
    static updateDateCreated(instance: Application){
        instance.date_created_gmt = moment().utc().toDate();
    }

    @BelongsToMany(() => Client, () => ClientApplication)
    clients: Client[]

    @HasMany(() => Abilite)
    abilites: Abilite[]

    @HasMany(() => Role)
    roles: Role[]

    
}
