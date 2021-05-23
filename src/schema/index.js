const graphql = require('graphql')

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean
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
		is_verified: {type: GraphQLBoolean}
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
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				phone: { type: GraphQLString }
			},
			async resolve(parent, args) {
				const data = await userController.addUser(args)
				return data
			}
		},
		verifyUser: {
			type: userType,
			args: {
				verification_token: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await userController.verifyUser(args)
				return data
			}
		}
	}
})

// Export the schema
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutations
})