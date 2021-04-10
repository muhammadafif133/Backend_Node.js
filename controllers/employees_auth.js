const passport = require('koa-passport');
const employeesBasicAuth = require('../strategies/employees_basic');

passport.use(employeesBasicAuth);

//authenticate() is use as a controller/route
module.exports = passport.authenticate(['basic'], {session:false});