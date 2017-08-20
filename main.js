var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require("columnify");
var bamManager = require("./bamazonManager");
var bamCustomer = require("./bamazonCustomer");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Dubnium105#',
    database: 'bamazondb'
});

connection.connect(function(err) {
    if (err) {
        console.log("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    //bamManager.startApp(connection);
    bamCustomer.startApp(connection);
});


//inquirer.prompt([{},{}]).then(function(response){});