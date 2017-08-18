var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '#Dubnium105#',
  database : 'bamazondb'
});

connection.connect(function(err){
  if(err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  startApp();
});

function startApp(){
  console.log("BAMAZON");
}