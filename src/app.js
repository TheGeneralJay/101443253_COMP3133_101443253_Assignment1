const { ApolloServer } = require("@apollo/server");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const PORT = 3000;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Create the Apollo server.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
app.use(express.json());

const loginPath = "/login";
const loginRoutes = require("./routes/loginRoutes.js");

app.use(loginPath, loginRoutes);

app.listen(PORT, async () => {
  await server.start();
  app.use(expressMiddleware(server));
  app.use(bodyParser.json());
  app.use("*", cors());

  console.log(`http://localhost:${PORT}`);
});
