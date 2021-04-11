const db = require('../helpers/database');

//add a new favourite record
exports.addFavourite = async function addFavourite (id, uid) {
  let query = "INSERT INTO favourites SET listingID=?, userID=? ON DUPLICATE KEY UPDATE listingID=listingID; ";
  const result = await db.run_query(query, [id, uid]);
  return result;
}
  
//remove a favourite record
exports.delFavourite = async function delFavourite (id, uid) {
  let query = "DELETE FROM favourites WHERE listingID=? AND userID=?; ";
  const result = await db.run_query(query, [id, uid]);
  return result;
}

//get list of favourites on listing from a user
exports.getList = async function getList (uid) {
  const query = "SELECT * FROM favourites WHERE userID=?;";
  const data = await db.run_query(query, [uid]);
  return data;
}

