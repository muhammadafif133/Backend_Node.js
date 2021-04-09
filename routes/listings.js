const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/listings');

const router = Router({prefix: '/api/v1/listings'});

router.get('/', getAll);
router.post('/', bodyParser(), createListings);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateListings);
router.del('/:id([0-9]{1,})', deleteListings);

async function getAll(ctx) {
  let listing = await model.getAll();
  if (listings.length) {
    ctx.body = listings;
  }
}

async function getById(ctx) {
  let id = ctx.params.id;
  let listing = await model.getById(id);
  if (listing.length) {
    ctx.body = listings[0];
  }
}

async function createListings(ctx) {
  const body = ctx.request.body;
  let result = await model.add(body);
  if (result) {
    ctx.status = 201;
    ctx.body = {ID: result.insertId}
  }
}

async function updateListings(ctx) {
  // TODO edit an existing article
}

async function deleteListings(ctx) {
  // TODO delete an existing article
}

module.exports = router;
