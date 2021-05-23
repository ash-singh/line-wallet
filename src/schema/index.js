const graphql = require('graphql')

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

// Import Controllers
const userController = require('../controllers/userController')

// Define Object Types
const userType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
        _id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
        age: {type: GraphQLInt}
    })
})

// Define Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		users: {
            type: new GraphQLList(userType),
			async resolve(parent, args) {
				return await userController.getUsers()
			}
        }
	}
})

// Define Mutations
const Mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		addUser: {
			type: userType,
			args: {},
			async resolve(args) {
				return ''
			}
		}
	}
})

// Export the schema
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutations
})