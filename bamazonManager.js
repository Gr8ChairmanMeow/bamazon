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

        console.log(response);
        switch (response.choice) {
            case 'View Products for Sale':
                connection.query("SELECT * FROM bamventory", function(error, results, fields) {

                    if (error) throw error;
                    //console.log(results);
                    console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                    setTimeout(continueThis, 1200);

                });
                break;
            case 'View Low Inventory':
                connection.query("SELECT * FROM bamventory WHERE qty < ?", ["5"], function(error, results, fields) {

                    if (error) throw error;
                    //console.log(results);
                    console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
                    setTimeout(continueThis, 1200);

                });
                break;
            case 'Add to Inventory':
                addBamventory();
                break;
            case 'Add New Product':
                inquirer.prompt([
                    {
                        type:'input',
                        name:'product_name',
                        message:'Enter the product name: ',
                    },
                    {
                        type:'input',
                        name:'department_name',
                        message:'Enter the department name: ',
                    },
                    {
                        type:'input',
                        name:'price',
                        message:'Enter the product price: ',
                    },
                    {
                        type:'input',
                        name:'qty',
                        message:'Enter the product qty: ',
                    }]).then(function(response){
                        addProduct(response);
                    });
                break;
        }

    });

}

/*

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

*/

function addProduct(productObj) {
    connection.query("INSERT INTO ?? SET ?", ["bamventory", productObj], function(error, results, fields) {

        if (error) throw error;
        setTimeout(continueThis, 1200);

    });
};

function addBamventory() {
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
            updateBam(response);
        }); //end inquirer
    });
};

function quit() {
    console.log("Goodbye...")
    connection.end();
}

function continueThis() {
    inquirer.prompt([{
        type: 'list',
        message: 'Anything else I can do for you?',
        choices: ['Yes', 'No'],
        name: "yesNo"
    }]).then(function(response) {
        if (response.yesNo === "Yes") {
            console.log("Returning to main menu...")
            setTimeout(startApp, 1200);
        } else {
            setTimeout(quit, 1000);
        }
    });
};

function updateBam(productObj) {
    //console.log(productObj.id);
    var productID = {
        item_id: productObj.id,
    };
    //console.log(productID);
    connection.query("SELECT * FROM bamventory WHERE ?", productID, function(error, results, fields) {
        if (error) throw error;
        //add if statment to update selected item qty IF results[0].qty - productObj.qty > -1;
        //console.log(results[0].qty - productObj.qty);
        var check = parseInt(results[0].qty) + parseInt(productObj.qty);
        //console.log(check)
        connection.query("UPDATE bamventory SET qty = ? WHERE ?", [check, productID], function(error, res, fields) { //works!
            if (error) throw error;
            console.log("Update complete!");
            console.log("You have added " +
                productObj.qty + " of " +
                results[0].product_name + " (" +
                results[0].department_name + ")");
            setTimeout(startApp, 1200); //possible replace with new function when expanding options.
        }); //end query
        //console.log(columnify(results, { columns: ['item_id', 'product_name', 'department_name', 'price', 'qty'] }));
    }); //end query
};