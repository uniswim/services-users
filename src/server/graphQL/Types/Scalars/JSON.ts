import { GraphQLScalarType } from "graphql"

export const GQLScalarJSON = new GraphQLScalarType({
    name: "JSON",
    serialize: (value: any) => { return JSON.stringify(value); },
    parseValue: (value) => { return JSON.parse(value); },
    parseLiteral: () => null
})