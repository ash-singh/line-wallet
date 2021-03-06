const graphql = require('graphql')

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLFloat
} = graphql

// Import Controllers
const userController = require('../controllers/userController')
const plaidController = require('../controllers/plaidController')
const dwollaController = require('../controllers/dwollaController')

// Define Object Types
const userType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
        _id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
		is_verified: {type: GraphQLBoolean}
    })
});

// Wallet Type
const walletType = new GraphQLObjectType({
	name: 'Wallet',
	fields: () => ({
        _id: { type: GraphQLID },
		id: { type: GraphQLString },
		funding_source: { type: GraphQLString },
		name: { type: GraphQLString },
		created: {type: GraphQLString}
    })
});

// Line app access token
const lineAccessTokenType = new GraphQLObjectType({
	name: 'LineAccessToken',
	fields: () => ({
        _id: { type: GraphQLID },
		access_token: { type: GraphQLString },
		email: { type: GraphQLString }
    })
});

// Plaid link token
const plaidLinkTokenType = new GraphQLObjectType({
	name: 'PlaidLinkToken',
	fields: () => ({
        expiration: { type: GraphQLString },
		link_token: { type: GraphQLString },
		request_id: { type: GraphQLString }
    })
});

// Wallet transaction
const walletTransactionType = new GraphQLObjectType({
	name: 'WalletTransaction',
	fields: () => ({
        created: { type: GraphQLString },
		user_id: { type: GraphQLString },
		wallet_id: { type: GraphQLString },
		amount: { type: GraphQLString },
		currency: { type: GraphQLString },
		created: { type: GraphQLString },
    })
});


// Wallet balance
const walletBalanceType = new GraphQLObjectType({
	name: 'WalletBalance',
	fields: () => ({
		wallet_id: { type: GraphQLString },
        currency: { type: GraphQLString },
		balance: { type: GraphQLString },
		total: { type: GraphQLString },
		lastUpdated: { type: GraphQLString },
    })
});

// Plaid account and rounting 
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
		createUser: {
			type: userType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent, args) {
				const data = await userController.addUser(args)
				return data
			}
		},
		verifyUser: {
			type: lineAccessTokenType,
			args: {
				verification_token: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await userController.verifyUser(args)
				return data
			}
		},
		login: {
			type: lineAccessTokenType,
			args: {
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await userController.login(args)
				return data
			}
		},
		createLinkToken: {
			type: plaidLinkTokenType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
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
				access_token: { type: new GraphQLNonNull(GraphQLString) },
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
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.getUserIdentity(args)
				return data
			}
		},
		getAccountRoutingInfo: {
			type: plaidAccountRountingType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await plaidController.getAccountRoutingInfo(args)
				return data
			}
		},
		createWallet: {
			type: walletType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await dwollaController.createWallet(args)
				return data
			}
		},
		depositFundsToWallet: {
			type: walletTransactionType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) },
				currency: { type: new GraphQLNonNull(GraphQLString) },
				amount: { type: new GraphQLNonNull(GraphQLFloat) }
			},
			async resolve(parent, args) {
				const data = await dwollaController.depositFundsToWallet(args)
				return data
			}
		},
		withdrawFundsFromWallet: {
			type: walletTransactionType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) },
				currency: { type: new GraphQLNonNull(GraphQLString) },
				amount: { type: new GraphQLNonNull(GraphQLFloat) }
			},
			async resolve(parent, args) {
				const data = await dwollaController.withdrawFundsFromWallet(args)
				return data
			}
		},
		getWalletBalance: {
			type: walletBalanceType,
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await dwollaController.getWalletBalance(args)
				return data
			}
		},
		getWalletTransactions: {
			type: new GraphQLList(walletTransactionType),
			args: {
				user_id: { type: new GraphQLNonNull(GraphQLString) },
				access_token: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const data = await dwollaController.getWalletTransactions(args)
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