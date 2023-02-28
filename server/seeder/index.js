const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "exam",
});

connection.connect(function (err) {
	if (err) {
		return console.error("error: " + err.message);
	} else {
		console.log("Connected to the MySQL server.");
		init();
	}
});

async function init() {
	await seeder();
}

async function seeder() {
	Promise.all([
		new Promise((resolve, reject) => {
			bcrypt.genSalt(saltRounds, function (err, salt) {
				bcrypt.hash("Asdf123", salt, function (err, hash) {
					connection.query(
						`INSERT INTO users (username, password, email) VALUES ('admin', '${hash}', 'admin@gmail.com')`,
						(err, result) => {
							if (err) reject(err);
							resolve(result);
						}
					);
				});
			});
		}),
	])
		.then((values) => {
			console.log("Data Seeded");
		})
		.catch((err) => {
			console.log(err);
		});
}

module.exports = seeder;
