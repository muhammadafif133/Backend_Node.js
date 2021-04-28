const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const can = require('../permissions/users');
const bcrypt = require('bcrypt');

const {validateUser, validateUserUpdate} = require('../controllers/validation');

const prefix = '/canine_shelter/v1/users'
const router = Router({prefix: prefix});

//define routes for user account
router.post('/login', auth, login);
router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);
router.get('/:id([0-9]{1,})/signUpCode', getUserRole )


// Function for login
async function login(ctx) {
  // return any details needed by the client
  const {ID, username, email, role} = ctx.state.user
  const links = {
    self: `${ctx.protocol}s://${ctx.host}${prefix}/${ID}`
  }
  ctx.body = {ID, username, email, role, links};
}

// Function to get all users account
async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);

  if (!permission.granted){
    ctx.status = 403;
  } else {
    console.log(ctx.request.query);
    /*
    let { limit=10, page=1, fields=null } = ctx.request.requery;
    //Ensure parameters are in integer
    limit = parseInt(limit);
    page = parseInt(page);
    
    // Validate pagination values to ensure they are sensible 
    limit = limit > 100 ? 100 : limit;
    limit = limit < 1 ? 10 : limit;
    page = page < 1 ? 1 : page;*/
    
    let {users, fields=null} = ctx.request.query;
    let result = await model.getAll(users);
    if (result.length) {
      if (fields !== null){
        // ensure the fields are contained in an array
        // need this since a single fields is passed as a string
        if (!Array.isArray(fields)){
          fields = [fields];
        }
        // then filter each row in the array of results
        // by only including the specified fields
        result = result.map(record => {
          let partial = {};
          for (let field of fields){
            partial [field] = record[field];             
          }
          return partial;
        });
      }
       ctx.body = result;
    }
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

// Function to get all users account by ID
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


// Function to get create users account 
async function createUser(ctx) {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

// Function to update users account
async function updateUser(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);  // check if exists
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

// Function to delete users account 
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

// Function to find users role
async function getUserRole (ctx){
  const id = ctx.params.id;
  let result = await model.findSecretCode(id);
  if (result.length){
    ctx.body = result;    
  }
}


module.exports = router;
