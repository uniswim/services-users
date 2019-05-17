import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class RoleInput {
    @InputField({ isNullable: true })
    nom?: string;

    @InputField({ isNullable: true })
    description?: string;
}

