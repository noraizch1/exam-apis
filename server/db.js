const mysql = require("mysql2");

// var connection = mysql.createPool({
//   host: "localhost",
//    user: "root",
//    password: "tack123!@#",
//    database: "polo",
//    debug: true
// });

var connection = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "exam",
});

module.exports = connection;
