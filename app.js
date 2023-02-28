let express = require("express");
let mongoose = require("mongoose");
require("dotenv").config();
// Create global app object
let app = express();

require("./server/app-config")(app);

// finally, let's start our server...
let server = app.listen(process.env.PORT || 3000, function () {
	console.log("Listening on port " + server.address().port);
});

process.on("SIGTERM", () => {
	console.info("SIGTERM signal received.");
	console.log("Closing http server.");

	server.close(() => {
		console.log("Http server closed.");
		mongoose.connection.close(false, () => {
			console.log("MongoDb connection closed.");

			process.kill(process.pid, "SIGTERM");
			process.exit(0);
		});
	});
});
process.once("SIGUSR2", function () {
	server.close(() => {
		console.log("Http server closed.");
		mongoose.connection.close(false, () => {
			console.log("MongoDb connection closed.");

			process.kill(process.pid, "SIGTERM");
			process.exit(0);
		});
	});
});

process.on("SIGINT", function () {
	// this is only called on ctrl+c, not restart
	server.close(() => {
		console.log("Http server closed.");
		mongoose.connection.close(false, () => {
			console.log("MongoDb connection closed.");

			process.kill(process.pid, "SIGTERM");
			process.exit(0);
		});
	});
});
