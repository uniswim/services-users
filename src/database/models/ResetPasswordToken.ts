import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, HasMany, Length, BeforeCreate, Default } from "sequelize-typescript"
import * as moment from "moment"

@Table({tableName:"resetpasswordtokens"})
export default class ResetPasswordToken extends Model<ResetPasswordToken> {

    @Column
    utilisateur_id: number;

    @Length({ max: 255 })
    @Column
    token: string;

    @Length({ max: 5 })
    @Default("new")
    @Column(DataType.STRING)
    status: "new" | "used";

    @Column
    date_created_gmt: Date;

    @BeforeCreate
    static updateDateCreated(instance: ResetPasswordToken){
        instance.date_created_gmt = moment().utc().toDate();
    }

    @Column
    date_modified_gmt?: Date;

    @BeforeCreate
    static updateDateModified(instance: ResetPasswordToken){
        instance.date_modified_gmt = moment().utc().toDate();
    }

}

