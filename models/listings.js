const db = require('../helpers/database');

//get a single listing by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM listings WHERE ID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

//list all the listings in the database
exports.getAll = async function getAll (page, limit, order) {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM listings;";
  let data = await db.run_query(query);
  return data;
}

//create a new listing in the database
exports.add = async function add (article) {
  let query = "INSERT INTO listings SET ?";
  let data = await db.run_query(query, article);
  return data;
}
