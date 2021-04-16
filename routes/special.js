const Router = require('koa-router');
const auth = require('../controllers/auth');

const router = Router({prefix: '/api/v1'});

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);

//public access header
function publicAPI(ctx) {
  ctx.body = {
    message: `PUBLIC PAGE: You requested a new message URI (root) of the API`
  }
}

//private user access header
function privateAPI(ctx){
  const user = ctx.state.user; //this will be accessed by the done(null, user) in strategy and add user value as 'ctx.state.user'
  ctx.body = {
    message: `Hello ${user.username} you registered on ${user.dateRegistered}`
  }
}

module.exports = router;
