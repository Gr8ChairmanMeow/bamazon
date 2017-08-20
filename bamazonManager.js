var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require("columnify");
var self = module.exports = {
    startApp: function(connection) {

        inquirer.prompt([{

            type: 'list',
            message: 'Hello, what can I do for you?',
            choices: ['View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ],
            name: 'choice',

        }]).then(function(response) {

           // console.log(response);
            switch (response.choice) {
                case 'View Products for Sale':
                    connection.query("SELECT * FROM bamventory", function(error, results, fields) {

                        if (error) throw error;
                        //console.log(results);
                        console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                        setTimeout(function() { self.continueThis(connection) }, 1000);

                    });
                    break;
                case 'View Low Inventory':
                    connection.query("SELECT * FROM bamventory WHERE qty < ?", ["5"], function(error, results, fields) {

                        if (error) throw error;
                        //console.log(results);
                        console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                        setTimeout(function() { self.continueThis(connection) }, 1000);

                    });
                    break;
                case 'Add to Inventory':
                    self.addBamventory(connection);
                    break;
                case 'Add New Product':
                    connection.query("SELECT ?? FROM ??",["department_name","bampartments"],function(error,results,fields){
                        var departmentsArr = [];
                        for (var i = 0; i < results.length; i++) {
                            departmentsArr.push(results[i].department_name);
                        }
                        //console.log(departmentsArr);
                        self.createSKU(connection,departmentsArr);
                    });
                    break;
            } //end switch

        }); //end then

    }, //end method

/*Function to query all unique departments from bamventory and return item_count per department
    connection.query("SELECT DISTINCT department_name,COUNT(department_name) AS item_count FROM ??" + 
        "GROUP BY department_name", ["bamventory"], function(error, results, fields) {
        console.log(results);
        //self.continueThis(connection);
    });
*/

    createSKU: function(connection,departments) {
        inquirer.prompt([{
                type: 'input',
                name: 'product_name',
                message: 'Enter the product name: ',
            },
            {
                type: 'list',
                name: 'department_name',
                choices: departments,
                message: 'Select the department: ',
            },
            {
                type: 'input',
                name: 'price',
                message: 'Enter the product price: ',
            },
            {
                type: 'input',
                name: 'qty',
                message: 'Enter the product qty: ',
            }
        ]).then(function(response) {
            self.addProduct(response, connection);
        }); //end then
    }, //end method

    addProduct: function(productObj, connection) {
        connection.query("INSERT INTO ?? SET ?", ["bamventory", productObj], function(error, results, fields) {
            if (error) throw error;
            connection.query("SELECT * FROM bamventory WHERE ?", { product_name: productObj.product_name }, function(error, results, fields) {
                console.log("The following product will be created.");
                console.log("SKU: " + results[0].item_id +
                    " | name: " + results[0].product_name +
                    " | department: " + results[0].department_name +
                    " | price: " + results[0].price +
                    " | inventory: " + results[0].qty);
                inquirer.prompt([{
                    type: 'list',
                    choices: ['yes', 'no'],
                    message: "Is this correct?",
                    name: 'yesNo'
                }]).then(function(response) {

                    if (response.yesNo === "yes") {
                        console.log("Created!");
                        setTimeout(function() { self.continueThis(connection) }, 1000);
                    } else {
                        console.log("Deleting...");
                        connection.query("DELETE FROM bamventory WHERE item_id = ?", [results[0].item_id], function(error, results, fields) {
                            setTimeout(function() { self.createSKU(connection) }, 1000);
                        }); //end DELETE query
                    } //end else
                }); //end then
            }); //end SELECT query
        }); //end INSERT query
    }, //end method

    addBamventory: function(connection) {
        connection.query("SELECT * FROM bamventory", function(error, results, fields) {
            if (error) throw error;
            //console.log(results);
            console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
            inquirer.prompt([{
                    type: 'input',
                    message: 'Input the ID of the product your would like to add inventory to: ',
                    name: 'id'
                },
                {
                    type: 'input',
                    message: 'Enter the inventory qty you would like to add: ',
                    name: 'qty'
                }
            ]).then(function(response) {
                self.updateBam(response, connection);
            }); //end then
        }); //end query
    }, //end method

    quit: function(connection) {
        console.log("Goodbye...")
        connection.end();
    },

    continueThis: function(connection) {
        inquirer.prompt([{
            type: 'list',
            message: 'Anything else I can do for you?',
            choices: ['Yes', 'No'],
            name: "yesNo"
        }]).then(function(response) {
            if (response.yesNo === "Yes") {
                console.log("Returning to main menu...")
                setTimeout(function() { self.startApp(connection) }, 1200);
            } else {
                setTimeout(function() { self.quit(connection) }, 1000);
            }
        }); //end then
    }, //end method

    updateBam: function(productObj, connection) {
        //console.log(productObj.id);
        var productID = {
            item_id: productObj.id,
        };
        //console.log(productID);
        connection.query("SELECT * FROM bamventory WHERE ?", productID, function(error, results, fields) {
            if (error) throw error;
            var check = parseInt(results[0].qty) + parseFloat(productObj.qty);
            //console.log(check)
            connection.query("UPDATE bamventory SET qty = ? WHERE ?", [check, productID], function(error, res, fields) { //works!
                if (error) throw error;
                console.log("Update complete!");
                console.log("You have added " +
                    productObj.qty + " of " +
                    results[0].product_name + " (" +
                    results[0].department_name + ")");
                setTimeout(function() { self.continueThis(connection) }, 1200);
            }); //end UPDATE query
        }); //end SELECT query
    } //end method
}; //end self/export object