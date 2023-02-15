import express from "express";
import bodyParser from "body-parser";
import { connectDB, HackerTable, SkillTable } from "./src/db.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

// Create a database if none exists
const database = connectDB("hackers.db");

const skills = new SkillTable(database);
const hackers = new HackerTable(database, skills);

const result = await hackers.insertHackerProfile("bob", "joe", "bob@joe.com", "123", [`{ "skill": "python", "rating": 8 }`, `{ "skill": "C++", "rating": 2 }`]);
// const result = await hackers.remove(2);
console.log("result: " + JSON.stringify(result));

// const result = await insertHacker(database, "bob", "joe", "bob@joe.com", "123");
// console.log("result: " + result);

// const id = await findHackerID(database, "Breanna Don", "Jackson Ltd", "lorettabrown@example.net", '+1-924-116-7963');
// console.log("findHackerID returned id: " + id);


// database.serialize(() => {
// 	findHackerID(database, "Breanna Dillon", "Jackson Ltd", "lorettabrown@example.net", " + 1 - 924 - 116 - 7963").then((x) => { console.log("returned id: " + x) });
// 	// database.run(``, async (err) => {
// 	// 	console.log("returned id: " + await findHackerID(database, "Breanna Dillon", "Jackson Ltd", "lorettabrown@example.net", "+1-924-116-7963"));
// 	// });
// 	// database.close((err) => {
// 	// 	if (err) return console.error(err.message);
// 	// 	console.log("Closing database");
// 	// })
// });


// database.run(`INSERT INTO hackers (name, company, email, phone, skills_id)
// 			  VALUES("Breanna Dillon", "Jackson Ltd", "lorettabrown@example.net", "+1-924-116-7963", 1)`, (err) => {
// 	if (err) return console.error(err.message);
// 	console.log("new row added");
// });


// database.run(`INSERT INTO skills (hacker_id, skill, rating)
// 			  VALUES (1, "OpenCV", 1)`, errCallback);


app.get("/", (req, res) => {
	res.send("Hello World!");
});


app.get("/users/", (req, res) => {
	database.all(`SELECT hackers.hacker_id, hackers.name, hackers.company, hackers.email, hackers.phone, skills.skill, skills.rating 
			      FROM hackers 
				  INNER JOIN skills 
				  ON hackers.hacker_id = skills.hacker_id;`, [], (hackers_err, rows) => {
		if (hackers_err)
			throw hackers_err;
		const hackers = new Map();
		rows.forEach((row) => {
			const hacker_id = row.hacker_id;
			if (hackers.has(hacker_id)) {
				var obj = JSON.parse(hackers.get(hacker_id));
				obj["skills"].push(JSON.parse(`{ "${row.skill}": "${row.rating}" }`));
				const s = JSON.stringify(obj);
				hackers.set(hacker_id, s);
			} else {
				const s = `{
					"name": "${row.name}",
					"company": "${row.company}",
					"email": "${row.email}",
					"phone": "${row.phone}",
					"skills": [{"${row.skill}":"${row.rating}"}]
				  }`;
				hackers.set(hacker_id, s);
			}
		});
		const result = [];
		hackers.forEach((value, key, map) => {
			result.push(value);
		});
		res.json(JSON.parse(result));
	})
});

// app.put("/users/add/", (req, res) => {

// });

app.get("/users/:id/", (req, res) => {
	database.serialize(() => {
		const id = parseInt(req.params["id"]);
		console.log(id);
		var output = "";
		database.get(`SELECT name, company, email, phone
				  FROM hackers
				  WHERE hacker_id = ?`, [id], (err, row) => {
			if (err) throw err;
			if (!row) { // id not in hackers table

			}
			else {
				output = JSON.parse(`{
					"name": "${row.name}",
					"company": "${row.company}",
					"email": "${row.email}",
					"phone": "${row.phone}",
					"skills": []
				}`);
				console.log("initial output: " + JSON.stringify(output));
			}
		});
		database.each(`SELECT skill, rating 
					   FROM skills
					   WHERE hacker_id = ?`, [id], (err, row) => {
			output["skills"].push(JSON.parse(`{"skill":"${row.skill}", "rating":"${row.rating}"}`));
			console.log("output is now: " + JSON.stringify(output));
		});
		database.run(``, (err) => {
			res.json(output);
		});
	});
});

app.put("/users/:id/", (req, res) => {
	database.serialize(() => {
		const id = parseInt(req.params["id"]);
		const update_request = req.body;
		for (const property in update_request) {
			if (property == "skills") {
				const skills = update_request[property];
				skills.forEach((skillEntry) => {
					const skill = skillEntry["skill"];
					const rating = skillEntry["rating"];
					var existsInTable = false;
					database.get(`SELECT skill, rating
								  FROM skills
								  WHERE skill = ? and hacker_id = ?`, [skill, id], (err, row) => {
						if (err) throw err;
						existsInTable = (row != undefined);
					});
					database.run(``, (err) => {
						if (existsInTable) {
							database.run(`UPDATE skills
										  SET rating = ${rating}
										  WHERE hacker_id = ${id} AND skill = "${skill}"`, (err) => {
								if (err) throw err;
							});
						} else {
							database.run(`INSERT INTO skills (hacker_id, skill, rating)
										  VALUES (${id}, "${skill}", ${rating})`, (err) => {
								if (err) throw err;
							});
						}
					});
				});
			} else {
				database.run(`UPDATE hackers 
				SET "${property}" = "${update_request[property]}"
				WHERE hacker_id = ${id}`, (err) => {
					if (err) throw err;
				});
			}
		}
	});
});

app.put("/", (req, res) => {
	// const body = req.body;
	console.log(req.body);
	res.json(req.body);
});

app.listen(port, () => {
	console.log(`Example REST Express app listening at http://localhost:${port}`);
});

