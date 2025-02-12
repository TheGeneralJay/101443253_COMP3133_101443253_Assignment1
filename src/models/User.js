const mongoose = require("mongoose");

// Password hashing.
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: String,
  updated_at: String,
});

// Hashing logic.
UserSchema.pre("save", async function save(next) {
  let user = this;

  // Hash password if modified or new.
  if (!user.isModified("password")) return next();

  // Salt.
  let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  // Password overridden with hashed version.
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare passwords for login.
UserSchema.methods.comparePassword = async function comparePassword(pass) {
  return bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
