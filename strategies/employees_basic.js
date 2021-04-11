const BasicStrategy = require('passport-http').BasicStrategy;
const employees = require('../models/employees');
const bcrypt = require('bcrypt');

const verifyPassword = function (employee, password) {
  // compare user.password with the password supplied
  const isMatch = bcrypt.compareSync(password, employee.password);
  return isMatch;
}

const checkUserAndPass = async (empUsername, password, done) => {
  // look up the user and check the password if the user exists
  
  let result;

  try {
    result = await employees.findByUsername(empUsername);
  } catch (error) {
    console.error(`Error during authentication for employee ${empUsername}`);
    return done(error);
  }  

  if (result.length) {
    const employee = result[0];
    if (verifyPassword(employee, password)) {
      console.log(`Successfully authenticated employee ${empUsername}`);
      return done(null, employee);
    } else {
      console.log(`Password incorrect for employee ${empUsername}`);
    }
  } else {
    console.log(`No user found with username ${empUsername}`);
  }
  return done(null, false); // username or password were incorrect
}

const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;
