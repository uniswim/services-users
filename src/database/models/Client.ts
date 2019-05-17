import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, HasMany, Length, BeforeCreate } from "sequelize-typescript"
import Application from "./Application";
import Contact from "./Contact";
import * as moment from "moment"
import ClientApplication from "./ClientApplication";
import Utilisateur from "./Utilisateur";
import ClientUtilisateur from "./ClientUtilisateur";

@Table
export default class Client extends Model<Client> {

    @Length({ max: 45 })
    @Column
    raison_sociale: string;

    @Column(DataType.TEXT)
    adresse: string;

    @Length({ max: 5 })
    @Column
    code_postal: string;

    @Length({ max: 45 })
    @Column
    ville: string;

    @Column
    date_created_gmt: Date;

    @BeforeCreate
    static updateDateCreated(instance: Client){
        instance.date_created_gmt = moment().utc().toDate();
    }

    @BelongsToMany(() => Application, () => ClientApplication)
    applications: Application[]

    @HasMany(() => Contact)
    contacts: Contact[]

    @BelongsToMany(() => Utilisateur, () => ClientUtilisateur)
    utilisateurs: Utilisateur[]
}

