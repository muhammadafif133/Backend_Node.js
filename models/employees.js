const db = require('../helpers/database');

//get a single user by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM employees WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//get a single user by the (unique) username
exports.findByUsername = async function findByUsername (empUsername){
  const query = "SELECT * FROM employees WHERE empUsername = ?;";
  const employee = await db.run_query(query, empUsername);
  return employee;
}

//list all the users in the database
exports.getAll = async function getAll (page, limit, order) {
  // TODO: use page, limit, order to give pagination
  const query = "SELECT * FROM employees;";
  const data = await db.run_query(query);
  return data;
}

//create a new user in the database
exports.add = async function add (employee) {
  const query = "INSERT INTO employees SET ?";
  const data = await db.run_query(query, employee);
  return data;
}

//delete a user by its id
exports.delById = async function delById (id) {
  const query = "DELETE FROM employees WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing user
exports.update = async function update (employee) {
  const query = "UPDATE employee SET ? WHERE ID = ?;";
  const values = [employee, employee.ID];
  const data = await db.run_query(query, values);
  return data;
}

