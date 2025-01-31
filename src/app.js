const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const DB = require("./database/db");
const port = 3000;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Create the Apollo server.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

DB.mongoose
  .connect(DB.URI)
  .then(async () => {
    console.log("Successfully connected to MongoDB.");
    return await startStandaloneServer(server);
  })
  .then((res) => {
    console.log(`Server running at port ${res.url}.`);
  });
