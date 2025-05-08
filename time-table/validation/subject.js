const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSubjectInput(data) {
  let errors = {};
  data.subject = !isEmpty(data.subject) ? data.subject : "";

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "This field is required";
  }

  if (!/^[a-zA-Z0-9 .'-]+$/.test(data.subject)) {
    errors.subject = "Only letters, numbers, spaces, dots, apostrophes, and dashes are allowed.";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
