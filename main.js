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
    console.log("Welcome to Bamazon! Your one stop node.js shop. " + connection.threadId);
    
    inquirer.prompt([{
            type: 'list',
            message: 'Are you a: ',
            choices: ['customer', 'manager'],
            name: 'choice'
        }
    ]).then(function(response) {
        switch (response.choice) {
            case 'customer':
                bamCustomer.startApp(connection);
                break;
            case 'manager':
                bamManager.startApp(connection);
                break;
        }
    });
});