import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class UtilisateurInput {
    @InputField({ isNullable: true })
    nom: string;

    @InputField({ isNullable: true })
    prenom: string;
}

