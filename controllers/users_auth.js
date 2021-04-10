const passport = require('koa-passport');
const usersBasicAuth = require('../strategies/users_basic');

passport.use(usersBasicAuth);

//authenticate() is use as a controller/route
module.exports = passport.authenticate(['basic'], {session:false});