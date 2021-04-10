const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/employees');
const bcrypt = require('bcrypt');

const router = Router({prefix: '/api/v1/employees'});

//define routes for employees
router.get('/', getAll);
router.post('/', bodyParser(), createEmployee);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateEmployee);
router.del('/:id([0-9]{1,})', deleteEmployee);

async function getAll(ctx) {
  const result = await model.getAll();
  if (result.length) {
    ctx.body = result;
  }
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await model.getById(id);
  if (result.length) {
    const employee = result[0]
    ctx.body = employee;
  }
}

async function createEmployee(ctx) {
  const body = ctx.request.body;
  const hash = bcrypt.hashSync(body.password, 10);
  body.password = hash; 
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

async function updateEmployee(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);  // check it exists
  if (result.length) {
    let employee = result[0];
    // exclude fields that should not be updated
    const {ID, dateRegistered, ...body} = ctx.request.body;
    Object.assign(employee, body); // overwrite updatable fields with body data
    result = await model.update(user);
    if (result.affectedRows) {
      ctx.body = {ID: id, updated: true, link: ctx.request.path};
    }
  }
}

async function deleteEmployee(ctx) {
  const id = ctx.params.id;
  const result = await model.delById(id);
  if (result.affectedRows) {
    ctx.body = {ID: id, deleted: true}
  }
}

module.exports = router;
