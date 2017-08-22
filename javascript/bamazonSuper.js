var inquirer = require("inquirer");
var mysql = require("mysql");
var columnify = require("columnify");
var functions = require("./functions");
var liri = require("./liri");
var self = module.exports = {
    startApp: function(connection) {

        inquirer.prompt([{

            type: 'list',
            message: 'Hello, what can I do for you?',
            choices: ['View Product Sales by Department',
                'View Item Count by Department',
                'View Products by Department',
                'Create New Department'
            ],
            name: 'choice',

        }]).then(function(response) {
            functions.appendFile(response.choice);
            switch (response.choice) {
                case 'View Product Sales by Department':
                    self.sales(connection);
                    break;
                case 'View Item Count by Department':
                    self.countDept(connection);
                    break;
                case 'View Products by Department':
                    self.productDept(connection);
                    break;
                case 'Create New Department':
                    self.createDept(connection);
                    break;
            } //end switch

        }); //end then

    }, //end method

    productDept: function(connection) {
        connection.query("SELECT ?? FROM ??", ["department_name", "bampartments"], function(error, results, fields) {
            if (error) throw error;
            var departmentsArr = [];
            for (var i = 0; i < results.length; i++) {
                departmentsArr.push(results[i].department_name);
            }
            inquirer.prompt([{
                type: 'list',
                choices: departmentsArr,
                message: "Which department would you like to view?",
                name: "choice"
            }]).then(function(response) {
                functions.appendFile(response.choice);
                connection.query("SELECT * FROM ?? WHERE ?", ["bamventory",{department_name:response.choice}], function(error, results, fields) {
                    if (error) throw error;
                    console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                    functions.appendFile(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                    self.continueThis(connection);
                });
            });
        });
    },

    countDept: function(connection) {
        connection.query("SELECT DISTINCT bampartments.department_id, bampartments.department_name," +
            "COUNT(bamventory.department_name) AS item_count FROM ?? " +
            "INNER JOIN bampartments " +
            "ON bampartments.department_name=bamventory.department_name " +
            "GROUP BY department_name", ["bamventory"],
            function(error, results, fields) {

                console.log(columnify(results, { columns: ['department_id', 'department_name', 'item_count'] }));
                functions.appendFile(columnify(results, { columns: ['department_id', 'department_name', 'item_count'] }));

                self.continueThis(connection);
            });
    },

    createDept: function(connection) {
        inquirer.prompt([{
                type: 'input',
                name: 'department_name',
                message: 'Enter new department name: ',
            },
            {
                type: 'input',
                name: 'over_head_costs',
                message: 'Enter overhead costs for new department: ',
            }
        ]).then(function(response) {
            functions.appendFile(response.choice);
            self.addDept(response, connection);
        }); //end then
    },

    addDept: function(departmentObj, connection) {
        connection.query("INSERT INTO ?? SET ?", ["bampartments", departmentObj], function(error, results, fields) {
            if (error) throw error;
            connection.query("SELECT * FROM bampartments WHERE ?", { department_name: departmentObj.department_name }, function(error, results, fields) {
                console.log("The following department will be created.");
                console.log("Department: " + results[0].department_name +
                    " | Overhead Costs: " + results[0].over_head_costs);

                functions.writeStream(["The following department will be created.",
                    "Department: " + results[0].department_name +
                    " | Overhead Costs: " + results[0].over_head_costs,
                    "--------------------------------------------------------"
                ]);

                inquirer.prompt([{
                    type: 'list',
                    choices: ['yes', 'no'],
                    message: "Is this correct?",
                    name: 'yesNo'
                }]).then(function(response) {
                    functions.appendFile(response.choice);
                    if (response.yesNo === "yes") {
                        console.log("Created!");
                        functions.appendFile("Created!");
                        setTimeout(function() { self.continueThis(connection) }, 1000);
                    } else {
                        console.log("Deleting...");
                        functions.appendFile("Deleting...");
                        connection.query("DELETE FROM bampartments WHERE ?", { department_id: results[0].department_id }, function(error, results, fields) {
                            setTimeout(function() { self.createDept(connection) }, 1000);
                        }); //end DELETE query
                    } //end else
                }); //end then
            }); //end SELECT query
        }); //end INSERT query
    },


    /*
    "SELECT bampartments.department_id,bampartments.department_name,bampartments.over_head_costs," +
                "SUM(bamventory.product_sales) AS total_sales,SUM(bamventory.product_sales)-bampartments.over_head_costs AS profit" +
                "FROM bamventory INNER JOIN bampartments ON bampartments.department_name=bamventory.department_name" +
                "GROUP BY department_name;"
    */

    sales: function(connection) {
        connection.query("SELECT bampartments.department_id,bampartments.department_name,bampartments.over_head_costs, " +
            "SUM(bamventory.product_sales) AS total_sales,SUM(bamventory.product_sales)-bampartments.over_head_costs AS profit " +
            "FROM bamventory INNER JOIN bampartments ON bampartments.department_name=bamventory.department_name " +
            "GROUP BY department_name;",
            function(error, results, fields) {
                if (error) throw error;
                //console.log(results);
                console.log(columnify(results, { columns: ['department_id', 'department_name', 'over_head_costs', 'total_sales', 'profit'] }));
                functions.appendFile(columnify(results, { columns: ['department_id', 'department_name', 'over_head_costs', 'total_sales', 'profit'] }));
                setTimeout(function() { self.continueThis(connection) }, 1000);
            });
    },

    quit: function(connection) {
        console.log("Goodbye...");
        functions.writeFile("");
        connection.end();
    },

    continueThis: function(connection) {
        inquirer.prompt([{
            type: 'list',
            message: 'Anything else I can do for you?',
            choices: ['Yes', 'No','Return to Liri'],
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
    } //end method
}; //end self/export object