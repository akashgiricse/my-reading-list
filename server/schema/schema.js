const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList} = graphql;

// dummy data

var books = [
    {name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1'},
    {name: 'The Final empire', genre: 'Fantasy', id: '2', authorId: '2'},
    {name: 'The long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
    {name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2'},
    {name: 'The color of magic', genre: 'Fantasy', id: '5', authorId: '3'},
    {name: 'The light Fantastic', genre: 'Sci-Fi', id: '6', authorId: '3'}

];

var authors = [
    {name: 'Patrick Rothfuss', age: 45, id: '1'},
    {name: 'Brandon Sanderson', age: 26, id: '2'},
    {name: 'Terry Pratchett', age: 52, id: '3'}

];



const BookType = new GraphQLObjectType({

    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId});
            }
        }
    })
});


const AuthorType = new GraphQLObjectType({

    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books,{ authorId: parent.id });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
    fields: {
       book: {
           type: BookType,
           args: {id: {type: GraphQLID}},
           resolve(parent, args){
               // code to get data from db or other resources
               return _.find(books, {id: args.id});
           }
       },

        author: {
           type: AuthorType,
           args: {id: {type: GraphQLID}},
           resolve(parent, args){
               // code to get data from db or other resources
               return _.find(authors, {id: args.id});
           }
       },

    }
});

module.exports = new GraphQLSchema({
   query: RootQuery
});