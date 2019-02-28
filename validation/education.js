const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  // here we are making sure that if the data has some value then continue
  // but if the data is empty object or undefined or null etc then set it to empty string
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // here we check if it is an empty string then we send an error message
  // so practically all of the empty, null, undefined are treated as empty string

  if (Validator.isEmpty(data.school)) {
    errors.school = "School name is required";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree name is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
