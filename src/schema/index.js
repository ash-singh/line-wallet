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
const plaidController = require('../controllers/plaidController')

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
});

const plaidLinkTokenType = new GraphQLObjectType({
	name: 'PlaidLinkToken',
	fields: () => ({
        expiration: { type: GraphQLString },
		link_token: { type: GraphQLString },
		request_id: { type: GraphQLString }
    })
});

const plaidAccountRountingType = new GraphQLObjectType({
	name: 'PlaidAccountRounting',
	fields: () => ({
        account: { type: GraphQLString },
		account_id: { type: GraphQLString },
		routing: { type: GraphQLString },
		wire_routing: { type: GraphQLString },
    })
});

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
});

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
		},
		createLinkToken: {
			type: plaidLinkTokenType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.createLinkToken(args)
				return data
			}
		},
		setPlaidAccessToken: {
			type: userType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				public_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.setAccessToken(args)
				return data
			}
		},
		getUserIdentity: {
			type: userType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.getUserIdentity(args)
				return data
			}
		},
		getAccountRoutingInfo: {
			type: new GraphQLList(plaidAccountRountingType),
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.getAccountRoutingInfo(args)
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