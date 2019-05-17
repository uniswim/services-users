import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class ContactInput {
    @InputField()
    nom: string;

    @InputField()
    prenom: string;

    @InputField({ isNullable: true })
    actif: boolean;

    @InputField({ isNullable: true })
    telephone_fixe: string;

    @InputField({ isNullable: true })
    telephone_portable: string;

    @InputField({ isNullable: true })
    email: string;
}

