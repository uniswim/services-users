import { GraphQLScalarType } from "graphql"
import * as moment from "moment"
import { ObjectType, Field } from "@dadoudidou/typegql";

export const GQLScalarDate = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize: (value: Date | string) => { 
        return moment(value).toISOString(); 
    },
    parseValue: (value) => { 
        return moment(value).toDate(); 
    },
    parseLiteral: (ast) => {
        if(ast.kind == "StringValue"){
            return moment(ast.value).toDate();
        }
        if (ast.kind === "IntValue") {
            return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
    },
})
