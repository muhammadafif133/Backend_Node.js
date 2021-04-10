const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

const verifyPassword = function (user, password) {
  // compare user.password with the password supplied
  return bcrypt.compareSync(password, user.password);
}

const checkUserAndPass = async (userUsername, password, done) => {
  // look up the user and check the password if the user exists

  let result;

  try {
    result = await users.findByUsername(userUsername);
  } catch (error) {
    console.error(`Error during authentication for user ${userUsername}`);
    return done(error);
  }

  if (result.length) {
    const user = result[0];
    if (verifyPassword(user, password)) {
      console.log(`Successfully authenticated user ${userUsername}`);
      return done(null, user);
    } else {
      console.log(`Password incorrect for user ${userUsername}`);
    }
  } else {
    console.log(`No user found with username ${userUsername}`);
  }
  return done(null, false); //username and password incorrect
}

const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;