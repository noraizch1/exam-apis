var router = require("express").Router();

var { OkResponse, BadRequestResponse, UnauthorizedResponse } = require("express-http-response");
var db = require("../../db");

const quizTable = "quiz";
const questionTable = "question";

router.post("/", (req, res, next) => {
	let questionIDArray = [];

	Promise.all(
		req.body.questions.map((question) => {
			return new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO ${questionTable} (title, isMandatory, answers, correct) VALUES ('${question.title}', '${question.isMandatory}', '${question.answers}', '${question.correct}')`,
					(err, result) => {
						if (err) {
							// console.log(err);
							reject(err);
						}
						console.log(result);
						questionIDArray.push(result.insertId);
						resolve(result);
					}
				);
			});
		})
	)
		.then((values) => {
			new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO ${quizTable} (title, description, questions) VALUES ('${req.body.title}',  '${
						req.body.description
					}', '${JSON.stringify(questionIDArray)}')`,
					(err, result) => {
						if (err) {
							console.log(err);
							reject(err);
						}
						resolve(result);
					}
				);
			})
				.then((values) => {
					res.status(200).send({ success: true, errors: null, data: values });
				})
				.catch((err) => {
					res.status(400).send({ success: false, errors: err, data: null });
				});
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

router.get("/", (req, res, next) => {
	Promise.all([
		new Promise((resolve, reject) => {
			db.query(`SELECT * FROM ${quizTable}`, (err, result) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(result);
			});
		}),
	])
		.then((values) => {
			res.status(200).send({ success: true, errors: null, data: values[0] });
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

router.get("/questions/:id", (req, res, next) => {
	new Promise((resolve, reject) => {
		db.query(`SELECT * from ${quizTable} WHERE id = ${req.params.id} `, (err, result) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(result[0]);
		});
	})
		.then((data) => {
			console.log(data);
			new Promise((resolve, reject) => {
				db.query(`SELECT * from ${questionTable} WHERE id IN (${JSON.parse(data.questions)})`, (err, result) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(result);
				});
			})
				.then((values) => {
					console.log("Questions:", values);
					res.status(200).send({ success: true, errors: null, data: values });
				})
				.catch((err) => {
					res.status(400).send({ success: false, errors: err, data: null });
				});
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

router.put("/:id", (req, res, next) => {
	new Promise((resolve, reject) => {
		db.query(`SELECT * from ${quizTable} WHERE id = ${req.params.id} `, (err, result) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(result[0]);
		});
	})
		.then((data) => {
			console.log("Quiz:", data);
			new Promise((resolve, reject) => {
				db.query(`DELETE from ${questionTable} WHERE id IN (${JSON.parse(data.questions)})`, (err, result) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(result);
				});
			})
				.then((values) => {
					console.log("Questions:", values);
					let questionIDArray = [];

					Promise.all(
						req.body.questions.map((question) => {
							return new Promise((resolve, reject) => {
								db.query(
									`INSERT INTO ${questionTable} (title, isMandatory, answers, correct) VALUES ('${question.title}', '${question.isMandatory}', '${question.answers}', '${question.correct}')`,
									(err, result) => {
										if (err) {
											// console.log(err);
											reject(err);
										}
										questionIDArray.push(result.insertId);
										resolve(result);
									}
								);
							});
						})
					)
						.then((values) => {
							new Promise((resolve, reject) => {
								db.query(
									`UPDATE ${quizTable} SET title = '${req.body.title}', description = '${
										req.body.description
									}', questions = '${JSON.stringify(questionIDArray)}' WHERE id = ${req.params.id}`,
									(err, result) => {
										if (err) {
											console.log(err);
											reject(err);
										}
										resolve(result);
									}
								);
							})
								.then((values) => {
									res.status(200).send({ success: true, errors: null, data: values });
								})
								.catch((err) => {
									res.status(400).send({ success: false, errors: err, data: null });
								});
						})
						.catch((err) => {
							res.status(400).send({ success: false, errors: err, data: null });
						});
				})
				.catch((err) => {
					res.status(400).send({ success: false, errors: err, data: null });
				});
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

router.delete("/:id", (req, res, next) => {
	new Promise((resolve, reject) => {
		db.query(`SELECT * from ${quizTable} WHERE id = ${req.params.id} `, (err, result) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(result[0]);
		});
	})
		.then((data) => {
			console.log(data);
			new Promise((resolve, reject) => {
				db.query(`DELETE from ${questionTable} WHERE id IN (${JSON.parse(data.questions)})`, (err, result) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(result);
				});
			})
				.then((values) => {
					console.log("Questions:", values);
					new Promise((resolve, reject) => {
						db.query(`DELETE from ${quizTable} WHERE id = ${req.params.id} `, (err, result) => {
							if (err) {
								console.log(err);
								reject(err);
							}
							resolve(result);
						});
					})

						.then((values) => {
							console.log("Questions:", values);
							res.status(200).send({ success: true, errors: null, data: values });
						})
						.catch((err) => {
							res.status(400).send({ success: false, errors: err, data: null });
						});
				})

				.catch((err) => {
					res.status(400).send({ success: false, errors: err, data: null });
				});
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

router.put("/question/:id", (req, res, next) => {
	new Promise((resolve, reject) => {
		db.query(
			`UPDATE ${questionTable} SET title = '${req.body.title}', isMandatory = '${req.body.isMandatory}', answers = '${req.body.answers}', correct = '${req.body.correct}' WHERE id = ${req.params.id}`,
			(err, result) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(result);
			}
		);
	})
		.then((values) => {
			console.log("Questions:", values);
			res.status(200).send({ success: true, errors: null, data: values });
		})
		.catch((err) => {
			res.status(400).send({ success: false, errors: err, data: null });
		});
});

module.exports = router;
