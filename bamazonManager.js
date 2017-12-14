var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  managerMenu();
});



// List a set of menu options:
function managerMenu() {
	var a = "View Products for Sale";
	var b = "View Low Inventory";
	var c = "Add to Inventory";
	var d = "Add New Product"
	inquirer.prompt([
	      {
	        type: "list",
	        name: "choice",
	        message: "What would you like to do?",
	        choices: [a, b, c, d]
	      },
	]).then(function(input) {
		// route user's choice to respective functions
		switch (input.choice) {
			case a: 
				viewProducts();
				break;
			case b: 
				viewLowInv();
				break;
			case c: 
				addToInv();
				break;
			case d: 
				addProduct();
				break;
		}
	});
};

// View Products for Sale: list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
	var query = connection.query(
	    "SELECT * FROM products",
	    function(err, res) {
	    	console.log("Full Inventory");
	      	for (i = 0; i < res.length; i++) {
	      		console.log(res[i].item_id + "  |  " + res[i].product_name + "  |  " + res[i].price + "  |  " + res[i].stock_quantity );
	      	};
	      	managerMenu();
	    }// end of query's callback function
    ); // end of query function
};


// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInv() {
	var query = connection.query(
	    "SELECT* FROM products WHERE stock_quantity < 5;",
	    function(err, res) {
	    	console.log("Low Inventory");
	      	for (i = 0; i < res.length; i++) {
	      		console.log(res[i].item_id + "  |  " + res[i].product_name + "  |  " + res[i].price + "  |  " + res[i].stock_quantity );
	      	};
	      	managerMenu();
	    }// end of query's callback function
    ); // end of query function
};

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addToInv() {

};

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addProduct() {

};