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

const corsOrigin = {
  origin: "http://localhost:4200",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  enablePreflight: true,
  optionSuccessStatus: 200,
};

app.use((req, res, next) => {
  const origin = "http://localhost:4200";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.listen(PORT, async () => {
  await server.start();
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use("/graphql", expressMiddleware(server));

  console.log(`-------------------------------------------`);
  console.log(`App listening at http://localhost:${PORT}`);
  console.log(`-------------------------------------------`);
});
