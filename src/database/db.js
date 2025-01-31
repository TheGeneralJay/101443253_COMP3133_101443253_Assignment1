const mongoose = require("mongoose");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");
const URI =
  "mongodb+srv://admin:qkkHWHB8jAGSdVaj@comp3133-101443253-assi.g57md.mongodb.net/";
// Models.
const User = require("../models/User");

module.exports = {
  mongoose,
  typeDefs,
  resolvers,
  URI,
  User,
};
