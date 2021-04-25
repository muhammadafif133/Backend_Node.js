const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const auth = require('../controllers/auth');
const can = require('../permissions/listings');

const listings = require('../models/listings');
const favourites = require('../models/favourites');

const {validateListing} = require('../controllers/validation');

const prefix = '/canine_shelter/v1/listings';
const router = Router({prefix: prefix});

//define listing routes used
router.get('/', getAll);
router.post('/', auth, bodyParser(), validateListing, createListing);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateListing, updateListing);
router.del('/:id([0-9]{1,})', auth, deleteListing);

//define favourite routes used
router.get('/:id([0-9]{1,})/favourites', auth, listByUserId);
router.post('/:id([0-9]{1,})/favourites', auth, favouriteList);
router.del('/:id([0-9]{1,})/favourites', auth, delFavouriteList);
router.get('/:id([0-9]{1,})/favourites', favouritesCount);

//----------------------------------------------------------------------------------
//listing functions

async function getAll(ctx) {
  const {page=1, limit=100, order="dateCreated", direction='ASC'} = ctx.request.query;
  const result = await listings.getAll(page, limit, order, direction);
  if (result.length) {
    const body = result.map(post => {
      // extract the post fields we want to send back (summary details)
      const {ID, dogName, summary, imageURL, employeeID} = post;
      // add links to the post summaries for HATEOAS compliance
      // clients can follow these to find related resources
      const links = {
        favourites: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/favourites`,
        self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
      }
      return {ID, dogName, summary, imageURL, employeeID, links};
    });
    ctx.body = body;
  }
}

// Function to get a dog listing by ID
async function getById(ctx) {
  const id = ctx.params.id;
  const result = await listings.getById(id);
  if (result.length) {
    const listing = result[0];
    ctx.body = listing;
  }
}

// Function to create dog listing 
async function createListing(ctx) {
  const body = ctx.request.body;
  const permission = can.add(ctx.state.user);
  if (!permission.granted){
    ctx.status = 403;
  } else {
    let result = await listings.add(body);
    if (result.affectedRows) {
      const id = result.insertId;
      ctx.status = 201;
      ctx.body = {ID: id, created: true, link: '${ctx.request.path}/${id}'};
    }  
  }
}

// Function to update dog listing
async function updateListing(ctx)
{
  const id = ctx.params.id;
  let result = await listings.getById(id); //check whether it exists
  if (result.length){
    let listing = result[0];
    const permission = can.update(ctx.state.user, listing)
    if (!permission.granted){
      ctx.status = 403;
    } else {
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
}

// Function to delete dog listing
async function deleteListing (ctx)
{
  const id = ctx.params.id;
  let result = await listings.getById(id);
  if (result.length){
    const data = result[0];
    console.log("trying to delete", data);
    const empPermission = can.empDelete(ctx.state.user, data);
    const adminPermission = can.adminDelete(ctx.state.user, data);
    if (empPermission.granted){
      const result = await listings.delById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true} 
      }
    } else if (adminPermission.granted){
      const result = await listings.delById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true}
      }
    } else {
      ctx.status = 403;
    }    
  }
}

//--------------------------------------------------------------------------------
//favourite functions

async function favouriteList (ctx) {
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await favourites.addFavourite(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? {message: "Favourited"} : {message: "error"};
}

async function delFavouriteList (ctx) {
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await favourites.delFavourite(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? {message: "Remove favourite"} : {message: "error"};
}

async function listByUserId(ctx){
  const uid = ctx.state.user.ID;
  const result = await favourites.getList(uid);
  if (result.length){
    const list = result[0];
    ctx.body = list;
  }
}

async function favouritesCount(ctx) {
  const id = ctx.params.id;
  const result = await favourites.count(id);
  ctx.body = result ? result : 0;
}

module.exports = router;
