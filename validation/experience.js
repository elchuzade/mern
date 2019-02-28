const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  // here we are making sure that if the data has some value then continue
  // but if the data is empty object or undefined or null etc then set it to empty string
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // here we check if it is an empty string then we send an error message
  // so practically all of the empty, null, undefined are treated as empty string

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
