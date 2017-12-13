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
  displayItems();
});

// Display all items for sale
function displayItems() {
	//Include the ids, names, and prices of products for sale.
	var query = connection.query(
	    "SELECT * FROM products",
	    function(err, res) {
	    	console.log("Welcome to my shop! You can buy so many things! Check out my inventory!");
	      	for (i = 0; i < res.length; i++) {
	      		console.log(res[i].item_id + "  |  " + res[i].product_name + "  |  " + res[i].department_name + "  |  " + res[i].price );
	      	};
	      	// prompt the user to place an order
	      	placeOrder();
	    }
    );
};

// The app should then prompt users with two messages.
function placeOrder() {
	// The first should ask them the ID of the product they would like to buy.
	inquirer.prompt([
	      {
	        name: "id",
	        message: "What would you like to buy? (Provide the ID of the product, please)."
	      }, 
	      // The second message should ask how many units of the product they would like to buy.
	      {
	        name: "qty",
	        message: "And, how many would you like to buy?"
	      },
	]).then(function(input) {
		// Once the customer has placed the order, 
	 	// call checkStock() function, passing on the user's responses
	  	checkStock(input.id, input.qty);
	});
};


// your application should check if your store has enough of the product to meet the customer's request.
function checkStock(id, reqQty) {
	var qUrl = "SELECT * FROM products WHERE ?"
	var query = connection.query( qUrl, [{
		item_id: id
	}],
	    function(err, res) {
	    	// initialize a variable to store the product's quantity 
	    	var stockQty = res[0].stock_quantity;
	    	if (stockQty <= reqQty) {
	    		// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
	    		console.log("Insufficient quantity! Purchase aborted.");
	    		connection.end();
	    	} else {
	    		// However, if your store does have enough of the product, you should fulfill the customer's order.
	    		processOrder(id, reqQty);
	    	};
	    }
    );
};

function processOrder(id, reqQty) {
	console.log("Processing order...");
	// This means updating the SQL database to reflect the remaining quantity.
	var qUrl = "UPDATE products SET stock_quantity = stock_quantity -" + reqQty + " WHERE item_id = " + id + " SELECT * FROM products;"
	var query = connection.query(qUrl,
	    function(err, res) {
	    	// Once the update goes through
	    	displayReceipt(id, reqQty);
	    }
    );	
};

// Show the customer the total cost of their purchase.
function displayReceipt(id, reqQty) {
	var qUrl = "SELECT * FROM products WHERE ?"
	var query = connection.query(qUrl, [{
		item_id: id
	}],function(err, res) {
	    	console.log("Unit Price: $" + res[0].price);
	    	console.log("Product: " + res[0].product_name);
	    	console.log("Quantity: " + reqQty);
	    	console.log("Total: $" + (reqQty * res[0].price));
	    }
    );	
};




