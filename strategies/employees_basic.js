const BasicStrategy = require('passport-http').BasicStrategy;
const employees = require('../models/employees');


const verifyPassword = function (employee, password) {
  // compare user.password with the password supplied
  return employee.password === password;
}

const checkUserAndPass = async (username, password, done) => {
  // look up the user and check the password if the user exists
  
  let result;

  try {
    result = await employees.findByUsername(username);
  } catch (error) {
    console.error(`Error during authentication for employee ${username}`);
    return done(error);
  }

  if (result.length) {
    const employee = result[0];
    if (verifyPassword(employee, password)) {
      console.log(`Successfully authenticated employee ${username}`);
      return done(null, employee);
    } else {
      console.log(`Password incorrect for employee ${username}`);
    }
  } else {
    console.log(`No user found with username ${username}`);
  }
  return done(null, false); // username or password were incorrect
}

const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;
