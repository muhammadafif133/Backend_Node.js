const db = require('../helpers/database');

//add a new favourite record
exports.addFavourite = async function addFavourite (id, uid) {
  let query = "INSERT INTO dogFavourites SET listingID=?, userID=? ON DUPLICATE KEY UPDATE listingID=listingID; ";
  const result = await db.run_query(query, [id, uid]);
  return result;
}
  
//remove a favourite record
exports.delFavourite = async function delFavourite (id, uid) {
  let query = "DELETE FROM dogFavourites WHERE listingID=? AND userID=?; ";
  const result = await db.run_query(query, [id, uid]);
  return result;
}

//get list of favourites on listing from a user
exports.getList = async function getList (uid) {
  const query = "SELECT * FROM dogFavourites WHERE userID=?;";
  const data = await db.run_query(query, [uid]);
  return data;
}

//count the favourites for a listing
exports.count = async function count (id) {
  let query = "SELECT count(1) as favourites FROM dogFavourites WHERE listingID=?;";
  const result = await db.run_query(query, [id]);
  return result[0].favourites;
}

