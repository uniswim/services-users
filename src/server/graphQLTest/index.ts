import { Schema, compileSchema, Query, SchemaRoot, ObjectType, Field } from "ntypegql";
import database from "@database/*";
import { GraphQLString } from "graphql";

@ObjectType()
class Test {
    @Field()
    raison_sociale: string
}



@SchemaRoot()
class root {
    @Query({ type: Test })
    async hello(): Promise<Test>{
        let _client = await database.models.Client.findById(16);
        return {
            raison_sociale: _client.raison_sociale
        };
    }
}

export const schema = compileSchema({ roots: [root] });

export default () => schema;