import "reflect-metadata";
require('dotenv').config()
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";

(async () => {
  const app = express();
  const PORT = 4000;

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  app.get("/", (_req, res) => {
    res.send("Hello world");
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`server running @ PORT:${PORT} 🚀`);
  });
})();
