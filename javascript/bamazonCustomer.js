var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require("columnify");
var functions = require("./functions");
var liri = require("./liri");
var self = module.exports = {

    startApp: function(connection) {

        connection.query("SELECT * FROM bamventory", function(error, results, fields) {
            if (error) throw error;
            //console.log(results);
            console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty', 'product_sales'] }));
            inquirer.prompt([{
                    type: 'input',
                    message: 'Input the ID of the product your would like to purchase: ',
                    name: 'id',
                    validate: function(input) {
                        if (isNaN(input)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: 'input',
                    message: 'Enter the qty you would like to purchase: ',
                    name: 'qty',
                    validate: function(input) {
                        if (isNaN(input)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            ]).then(function(response) {
                functions.appendFile(response.choice); //need to remove this, returns undefined
                self.buy(response, connection);
            }); //end then
        }); //end SELECT query
    }, //end method

    quit: function(connection) {
        console.log("Goodbye...");
        functions.writeFile("");
        connection.end();
    },

    continueThis: function(connection) {
        inquirer.prompt([{
            type: 'list',
            message: 'Anything else I can do for you?',
            choices: ['Yes', 'No', 'Return to Liri'],
            name: "yesNo"
        }]).then(function(response) {
            if (response.yesNo === "Yes") {
                console.log("Returning to main menu...")
                setTimeout(function() { self.startApp(connection) }, 1200);
            } else if (response.yesNo === 'Return to Liri') {
                connection.end();
                console.log("Loading Liri...");
                functions.appendFile("Loading Liri...");
                setTimeout(liri.startApp,1000);
            } else {
                setTimeout(function() { self.quit(connection) }, 1000);
            }
        }); //end then
    }, //end method

    buy: function(productObj, connection) {
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
                var totalSale = parseInt(productObj.qty) * parseFloat(results[0].price);
                connection.query("UPDATE bamventory SET qty = ?, ? WHERE ?", [check, { product_sales: results[0].product_sales + totalSale }, productID], function(error, res, fields) { //works!
                    if (error) throw error;

                    console.log("Transaction complete!");
                    console.log("You have purchased " +
                        productObj.qty + " of " +
                        results[0].product_name + " (" +
                        results[0].department_name + ")");
                    console.log("Total cost: " + totalSale);

                    functions.writeStream(["Transaction complete!", "You have purchased " +
                        productObj.qty + " of " +
                        results[0].product_name + " (" +
                        results[0].department_name + ")", "Total cost: " + totalSale
                    ]);

                    setTimeout(function() { self.continueThis(connection) }, 1200); //possible replace with new function when expanding options.
                }); //end UPDATE query
            } else {
                console.log("Not enough inventory!");
                functions.appendFile("Not enough inventory!");
                self.continueThis(connection);
            } //end else
        }); //end SELECT query
    } //end method
}; //end self/export object