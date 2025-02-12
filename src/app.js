const { ApolloServer } = require("@apollo/server");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database/db.js");
const { expressMiddleware } = require("@apollo/server/express4");
const PORT = 4000;

// DB Connection.
db.connectToDB();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Create the Apollo server.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.listen(PORT, async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.use("*", cors());

  console.log(`-------------------------------------------`);
  console.log(`App listening at http://localhost:${PORT}`);
  console.log(`-------------------------------------------`);
});
