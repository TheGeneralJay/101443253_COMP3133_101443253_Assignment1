const mongoose = require("mongoose");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const connectToDB = () => {
  mongoose.connect(MONGO_URI);

  console.log("-------------------------------------------");
  console.log(`INFO: Successfully connected to MongoDB.`);
  console.log("-------------------------------------------");
};

// Models.
const User = require("../models/User");

module.exports = {
  connectToDB,
  mongoose,
  typeDefs,
  resolvers,
  User,
};
