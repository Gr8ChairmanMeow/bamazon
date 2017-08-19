var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require("columnify");
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
    startApp();
});

function startApp() {
    //console.log("BAMAZON");
    connection.query("SELECT * FROM bamventory", function(error, results, fields) {
        if (error) throw error;
        //console.log(results);
        console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
        inquirer.prompt([{
                type: 'input',
                message: 'Input the ID of the product your would like to purchase: ',
                name: 'id'
            },
            {
                type: 'input',
                message: 'Enter the qty you would like to purchase: ',
                name: 'qty'
            }
        ]).then(function(response) {
            buy(response);
        }); //end inquirer
    }); //
}

function continueThis() {
    inquirer.prompt([{
        type: 'list',
        message: 'Would you like to try again?',
        choices: ['Yes', 'No'],
        name: "yesNo"
    }]).then(function(response) {
        if (response.yesNo === "Yes") {
            console.log("Returning to main menu...")
            setTimeout(startApp, 1200);
        }
    });
};

function buy(productObj) {
    //console.log(productObj.id);
    var productID = {
        item_id: productObj.id,
    };
    //console.log(productID);
    connection.query("SELECT * FROM bamventory WHERE ?", productID, function(error, results, fields) {
        if (error) throw error;
        //add if statment to update selected item qty IF results[0].qty - productObj.qty > -1;
        //console.log(results[0].qty - productObj.qty);
        var check = results[0].qty - productObj.qty;
        if (check > -1) {
            connection.query("UPDATE bamventory SET qty = ? WHERE ?", [check, productID], function(error, res, fields) { //works!
                if (error) throw error;
                console.log("Transaction complete!");
                console.log("You have purchased " +
                    productObj.qty + " of " +
                    results[0].product_name + " (" +
                    results[0].department_name + ")");
                setTimeout(startApp, 1200); //possible replace with new function when expanding options.
            }); //end query
        } else {
            console.log("Not enough inventory!");
            continueThis();
        }
        //console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
    }); //end query
};