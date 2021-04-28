const db = require('../helpers/database');

//get a single listing by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM listings WHERE ID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

//list all the listings in the database
exports.getAll = async function getAll (page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'DESC'){
    query = "SELECT * FROM listings ORDER BY ?? DESC LIMIT ? OFFSET ?;";
  } else {
    query = "SELECT * FROM listings ORDER BY ?? ASC LIMIT ? OFFSET ?;";
  }
  const values = [order, limit, offset];
  const data = await db.run_query(query, values);
  return data;
}

//create a new listing in the database
exports.add = async function add (listing) {
  let query = "INSERT INTO listings SET ?;"
  let data = await db.run_query(query, listing);
  return data;
}

//delete an article by its id
exports.delById = async function delById (id) {
  const query = "DELETE FROM listings WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing listing
exports.update = async function update (listing){
  const query = "UPDATE listings SET ? WHERE ID = ?;";
  const values = [listing, listing.ID];
  const data = await db.run_query(query, values);
  return data;
}