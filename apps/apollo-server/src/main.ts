import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';

import { JWT_EXPIRES_IN, JWT_SECRET } from './environments';
import { getMe } from './functions';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      me,
      jwt: {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      },
    };
  },
});

server.applyMiddleware({ app });

const port = process.env.port || 3333;
app
  .listen(port, () => {
    console.log(`Listening at http://localhost:${port}/graphql`);
  })
  .on('error', console.error);