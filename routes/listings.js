const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const employeeAuth = require('../controllers/employees_auth');
const userAuth = require('../controllers/users_auth');

const listings = require('../models/listings');
const favourites = require('../models/favourites');

const {validateListing} = require('../controllers/validation');

const prefix = '/api/v1/articles';
const router = Router({prefix: prefix});

//define listing routes used
router.get('/', getAll);
router.post('/', employeeAuth, bodyParser(), validateListing, createListings);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', employeeAuth, bodyParser(), validateListing, updateListings);
router.del('/:id([0-9]{1,})', employeeAuth, deleteListings);

//define favourite routes used
router.get('/:id([0-9]{1,})/favourites', userAuth, listByUserId);
router.post('/:id([0-9]{1,})/favourites', userAuth, favouriteList);
router.del('/:id([0-9]{1,})/favourites', userAuth, delFavouriteList);

//----------------------------------------------------------------------------------
//listing functions

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

//--------------------------------------------------------------------------------
//favourite functions

async function favouriteList (ctx) {
  // TODO: add error handling
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await favourites.addFavourite(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? {message: "Favourited"} : {message: "error"};
}

async function delFavouriteList (ctx) {
  // TODO: remove error handling
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await favourites.delFavourite(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? {message: "Remove favourite"} : {message: "error"};
}

async function listByUserId(ctx){
  const id = ctx.param.id;
  const result = await model.getList(id);
  if (result.length){
    const list = result[0]
    ctx.body = list;
  }
}

module.exports = router;
