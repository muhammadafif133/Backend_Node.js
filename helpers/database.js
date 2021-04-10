const mysql = require('promise-mysql');
const info = require('../config');
const { v4: uuidv4 } = require('uuid');

//define an async utility function to get a connection
//run a SQL query then end the connection
exports.run_query = async function run_query(query, values){
  try{
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    return data;
  }catch (error){
    //handliing unknown error from being propagate up to response object
    
    const errorId = uuidv4();
    console.error(Date.now(), errorId, query, values, error.message);
    throw new DatabaseException("Database error.", error.code, errorId);
  }
}

function DatabaseException (message, code, id){
  this.message = message;
  this.code = code;
  this.id = id;
  this.name = 'DatabaseException';
}