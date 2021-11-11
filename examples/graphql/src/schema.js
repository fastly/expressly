import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

export const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      echo: {
        args: {
          text: {
            type: GraphQLString,
          },
        },
        type: GraphQLString,
        resolve: (_root, args) => {
          return args.text;
        },
      },
    }),
  }),
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      alphabet: {
        type: new GraphQLList(GraphQLString),
        resolve: () => {
          return [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
          ];
        },
      },
      song: {
        type: new GraphQLObjectType({
          name: "Song",
          fields: () => ({
            firstVerse: {
              type: GraphQLString,
              resolve: () => "Now I know my ABC's.",
            },
            secondVerse: {
              type: GraphQLString,
              resolve: () => "Next time won't you sing with me?",
            },
          }),
        }),
        resolve: () => ({}),
      },
    }),
  }),
});
