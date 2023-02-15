import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import fs from "fs";



const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

function loadData() {
	fs.readFile('./data.json', 'utf8', (err, jsonString) => {
		if (err) {
			console.log("File read failed:", err);
			return;
		}
		try {
			const data = JSON.parse(jsonString);
			data.forEach((value) => {
				console.log("value: " + JSON.stringify(value));
			})
		} catch (err) {
			console.log("Error parsing JSON", err);
		}
	})
}

// loadData();


// Create a database if none exists
const database = new sqlite3.Database("hackers.db", sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
	console.log("connection successful");
});


function errCallback(err) {
	if (err) return console.error(err.message);
	console.log("inserted");
}

// const hackers = [];
// const sql = `SELECT hacker_id, name, company, email, phone
// 				 FROM hackers`;
// database.all(sql, [], (hackers_err, hackers_rows) => {
// 	if (hackers_err) throw hackers_err;

// 	hackers_rows.forEach((hackers_row) => {
// 		const skill_sql = `SELECT skill, rating
// 						   FROM skills
// 						   WHERE hacker_id = ?`;
// 		const skills_array = [];
// 		database.each(skill_sql, [hackers_row.hacker_id], (skills_err, skills_row) => {
// 			if (skills_err) throw skills_err;
// 			skills_array.push(`{ "skill":"${skills_row.skill}", "rating":"${skills_row.rating}" }`);
// 			console.log(skills_array.toString());
// 		});
// 		console.log("skills: " + skills_array.toString());
// 		// hackers.push(JSON.parse(`{
// 		// 								"name":"${hackers_row.name}", 
// 		// 								"company":"${hackers_row.company}", 
// 		// 								"email":"${hackers_row.email}", 
// 		// 								"phone":"${hackers_row.phone}",
// 		// 								"skills": ` + skills.toString() + `}`));
// 	});
// });

// console.log(hackers);

// function
// const sql = `INSERT INTO hackers (name, company, email, phone, skills_id)
//               VALUES(?,?,?,?,?)`;

// database.run(sql, ['john smith', 'Shopify', 'johnsmith@shopify.com', '1234567890', 1], (err) => {
//   if (err) return console.error(err.message);
//   console.log("new row added");
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

app.put("/", (req, res) => {
	// const body = req.body;
	console.log(req.body);
	res.json(req.body);
});

app.listen(port, () => {
	console.log(`Example REST Express app listening at http://localhost:${port}`);
});


// database.close((err) => {
// 	if (err) return console.error(err.message);
// 	console.log("Closing database");
// })