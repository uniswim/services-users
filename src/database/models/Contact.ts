import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, Length, NotNull, BeforeCreate } from "sequelize-typescript"
import Client from "./Client";
import * as moment from "moment";

@Table
export default class Contact extends Model<Contact> {

    @ForeignKey(() => Client)
    @Column
    client_id: number;

    @BelongsTo(() => Client)
    client: Client

    @Column
    date_created_gmt: Date;

    @BeforeCreate
    static updateDateCreated(instance: Contact){
        instance.date_created_gmt = moment().utc().toDate();
    }

    @Column({defaultValue: true})
    actif: boolean;

    @Length({ max: 45 })
    @Column
    nom: string;

    @Length({ max: 45 })
    @Column
    prenom: string;

    @Length({ max: 10 })
    @Column
    telephone_fixe: string;

    @Length({ max: 10 })
    @Column
    telephone_portable: string;

    @Column
    email: string;
}
