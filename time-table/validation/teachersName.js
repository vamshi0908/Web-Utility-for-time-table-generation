const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTeachersNameInput(data) {
  let errors = {};

  data.teachersName = !isEmpty(data.teachersName) ? data.teachersName : "";

  if (Validator.isEmpty(data.teachersName)) {
    errors.teachersName = "This field is required";
  }

  if (!/^[a-zA-Z0-9 .'-]+$/.test(data.teachersName)) {
    errors.teachersName = "Only letters, numbers, spaces, dots, apostrophes, and dashes are allowed.";
  }
  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
