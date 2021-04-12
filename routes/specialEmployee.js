const Router = require('koa-router');
const employeesAuth = require('../controllers/employees_auth');

const router = Router({prefix: '/api/v1'});

router.get('/', publicAPI);
router.get('/employeesprivate', employeesAuth, employeesPrivateAPI);

//public access header
function publicAPI(ctx) {
  ctx.body = {
    message: `PUBLIC PAGE: You requested a new message URI (root) of the API`
  }
}

//private employee access header
function employeesPrivateAPI(ctx){
  const employee = ctx.state.user; //this will be accessed by the done(null, user) in strategy and add employee value as 'ctx.state.user'
  ctx.body = {
    message: `Hello ${employee.empUsername} you registered on ${employee.dateRegistered}`}
}

module.exports = router;
