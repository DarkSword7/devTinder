const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  } else if (firstName.length < 3 || firstName.length > 20) {
    throw new Error("First name must be between 3 and 20 characters");
  } else if (lastName && lastName.length > 20) {
    throw new Error("Last name must be less than 20 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = {
  validateSignUpData,
};
