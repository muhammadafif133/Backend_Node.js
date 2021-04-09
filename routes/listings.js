const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const listings = require('../models/listings');

const router = Router({prefix: '/api/v1/listings'});

//define listing routes used
router.get('/', getAll);
router.post('/', bodyParser(), createListings);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateListings);
router.del('/:id([0-9]{1,})', deleteListings);


async function getAll(ctx) {
  const {page=1, limit=100, order="dateCreated", direction='ASC'} = ctx.request.query;
  const result = await listings.getAll(page, limit, order, direction);
  if (result.length) {
    ctx.body = result;
  }
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await listings.getById(id);
  if (result.length) {
    const listing = result[0];
    ctx.body = listing;
  }
}

async function createListings(ctx) {
  const body = ctx.request.body;
  let result = await listings.add(body);
  if (result.affectedRows) {
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: '${ctx.request.path}/${id}'};
  }
}

async function updateListings(ctx) {
  const id = ctx.params.id;
  let result = await listings.getById(id); //check whether it exists
  if (result.length){
    let listing = result[0];
    //exclude fields that should not be updated
     const {ID, dateCreated, dateModified, employeeID, ...body} = ctx.request.body;
    //overwrite updatable fileds with remaining body data
    Object.assign(listing, body);
    result = await listings.update(listing);
    if (result.affectedRows){
      ctx.body = {ID: id, updated: true, link: ctx.request.path};
    }
  }
}

async function deleteListings(ctx) {
  const id = ctx.params.id;
  const result = await listings.delById(id)
  if (result.affectedRows){
    ctx.body = {ID: id, deleted: true}
  }
}

module.exports = router;
