const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const can = require('../permissions/users');
const bcrypt = require('bcrypt');

const {validateUser, validateUserUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/users'});

//define routes for user account
router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);


async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);

  if (!permission.granted){
    ctx.status = 403;
  } else {
    const result = await model.getAll();
    if (result.length) {
       ctx.body = result;
    }
  }
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await model.getById(id);
  if(result.length){
    const data = result[0]
    const empPermission = can.empRead(ctx.state.user, data);
    const userPermission = can.userRead(ctx.state.user, data);
    if (empPermission.granted){
      ctx.body = empPermission.filter(data);
    } else if (userPermission.granted){
      ctx.body = userPermission.filter(data);
    } else {
      ctx.status = 403;
    }
  }
}



async function createUser(ctx) {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

async function updateUser(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);  // check it exists
  if (result.length) {
    let data = result[0];
    const empPermission = can.empUpdate(ctx.state.user, data);
    const userPermission = can.userUpdate(ctx.state.user, data);
    if (empPermission.granted){
      // exclude fields that should not be updated
      const newData = empPermission.filter(ctx.request.body);
      // overwrite updatable fields with body data
      Object.assign(newData, {ID: id});
      result = await model.update(newData);
      if (result.affectedRows) {
        ctx.body = {ID: id, updated: true, link: ctx.request.path};
      }
    } else if (userPermission.granted){
      // exclude fields that should not be updated
      const newData = userPermission.filter(ctx.request.body);
      // overwrite updatable fields with body data
      Object.assign(newData, {ID: id});
      result = await model.update(newData);
      if (result.affectedRows) {
        ctx.body = {ID: id, updated: true, link: ctx.request.path};
      }
    } else {
      ctx.status = 403;
    }
  }
}

async function deleteUser(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);
  if (result.length){
    const data = result[0];
    console.log("trying to delete", data);
    const empPermission = can.empDelete(ctx.state.user, data);
    const userPermission = can.userDelete(ctx.state.user, data);
    if (empPermission.granted){
      const result = await model.delById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true}
      }
    } else if (userPermission.granted){
      const result = await model.delById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true}
      }
    } else {
      ctx.status = 403;
    }    
  }
}



module.exports = router;
