const Gender = require("./enums/Gender");

const isValidGender = (gender) => {
  if (gender.toUpperCase() in Gender) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isValidGender };
