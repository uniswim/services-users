import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class ClientInput {
    @InputField({ isNullable: true })
    raison_sociale?: string;

    @InputField({ isNullable: true })
    adresse?: string;

    @InputField({ isNullable: true })
    code_postal?: string;

    @InputField({ isNullable: true })
    ville?: string;
}

