import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@ObjectType()
export default class ServerStatus {

    @Field()
    message: string
}