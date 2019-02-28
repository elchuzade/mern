const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  // here we are making sure that if the data has some value then continue
  // but if the data is empty object or undefined or null etc then set it to empty string
  data.text = !isEmpty(data.text) ? data.text : "";

  // here we check if it is an empty string then we send an error message
  // so practically all of the empty, null, undefined are treated as empty string

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
