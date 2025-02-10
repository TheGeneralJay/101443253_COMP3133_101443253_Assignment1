const express = require("express");
const db = require("../database/db.js");
const router = express.Router();
const { Query } = require("../graphql/resolvers.js");

// DB Connection.
db.mongoose.connect(db.URI);

router.post("/", async (req, res) => {
  try {
    const loginDetails = req.body;

    const storedDetails = await Query.login(
      loginDetails.username,
      loginDetails.password
    );

    // If we get here, log the user in.
    res.status(200).send(storedDetails);
  } catch (err) {
    res.status(400).send("ERROR: Username or password is incorrect.");
    return;
  }
});

module.exports = router;
