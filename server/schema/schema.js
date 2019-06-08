const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			async resolve({ authorId }, args) {
				return await Author.findById(authorId);
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			async resolve({ id }, args) {
				return await Book.find({ authorId: id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, { id }) {
				// code to get data from DB
				return await Book.findById(id);
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, { id }) {
				return await Author.findById(id);
			},
		},
		books: {
			type: new GraphQLList(BookType),
			async resolve(parent, args) {
				return await Book.find({});
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			async resolve(parent, args) {
				return await Author.find({});
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			async resolve(parent, { name, age }) {
				const author = new Author({
					name,
					age,
				});
				return await author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) },
			},
			async resolve(parent, { name, genre, authorId }) {
				const book = new Book({
					name,
					genre,
					authorId,
				});
				return await book.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
