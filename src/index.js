const app = require('./server.js');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');
const { port } = require('./config');

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(port);
console.log('Running a Line wallet GraphQL API server at http://localhost:4000/graphql');