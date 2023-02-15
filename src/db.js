import fs from "fs";
import sqlite3 from "sqlite3";

function getErrCallback(successMessage) {
	return (err) => {
		if (err) return console.error(err.message);
		console.log(successMessage);
	};
}



function connectDB(dbFile) {
	return new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
		if (err) return console.error(err.message);
		console.log("SQLite connection successful");
	});
}

// resolves to true if successful run
function dbRunMethodPromise(db, query, params) {
	return new Promise((resolve, reject) => {
		db.run(query, params, (err) => {
			if (err) {
				console.log("run method error");
				console.log("query: " + query);
				console.log("params: " + params);
				reject(err);
			}
			resolve(true);
		});
	});
}

// returns promise for row from get method
function dbGetMethodPromise(db, query, params) {
	return new Promise((resolve, reject) => {
		db.get(query, params, (err, row) => {
			if (err) {
				console.log("get method error");
				reject(err);
			}
			resolve(row);
		});
	});
}

// returns promise for rows from all method
function dbAllMethodPromise(db, query, params) {
	return new Promise((resolve, reject) => {
		db.all(query, params, (err, rows) => {
			if (err) {
				console.log("get method error");
				reject(err);
			}
			resolve(rows);
		});
	});
}

class HackerTable {
	constructor(db, skillTable) {
		this.db = db;
		this.skillTable = skillTable;
	}

	// returns full user profile for hacker_id
	async getHacker(hacker_id) {
		const sql = `SELECT name, company, email, phone
					 FROM hackers
					 WHERE hacker_id = ?`;
		const row = await dbGetMethodPromise(this.db, sql, [hacker_id]);
		if (!row) {
			console.log(`hacker_id ${hacker_id} not found`);
			return {};
		}
		const skills = [];
		const skillrows = await this.skillTable.getHackerSkills(hacker_id);
		skillrows.forEach((skill) => { skills.push(JSON.stringify(skill)) });
		const profile = JSON.parse(`{
										"name": "${row.name}",
										"company": "${row.company}",
										"email": "${row.email}",
										"phone": "${row.phone}",
										"skills": [${skills}]
									}`);
		return profile;
	}

	async getAllHackers() {
		const sql = `SELECT hacker_id
					 FROM hackers`;
		const hacker_ids = await dbAllMethodPromise(this.db, sql, []);
		const profiles = [];
		if (!hacker_ids) {
			console.log("no hackers");
		} else {
			for (const i in hacker_ids) {
				const hacker_id = parseInt(hacker_ids[i]["hacker_id"]);
				const profile = await this.getHacker(hacker_id);
				profiles.push(profile);
			}
		}
		return profiles;
	}

	// returns true if update succeeded
	async updateHacker(hacker_id, request) {
		for (const property in request) {
			if (property == "skills") {
				const skills = request[property];
				for (const i in skills) {
					const skillEntry = skills[i];
					const skill = skillEntry["skill"];
					const rating = skillEntry["rating"];
					const insertResult = await this.skillTable.insert(hacker_id, skill, rating);
					if (!insertResult) {
						console.log("unable to insert skill " + skill);
						return false;
					}
				}
			} else {
				const value = request[property];
				const sql = `UPDATE hackers
							 SET ${property} = ? 
							 WHERE hacker_id = ?`;
				const runResult = await dbRunMethodPromise(this.db, sql, [value, hacker_id]);
				if (!runResult) {
					console.log("Unable to update " + property + " for hacker_id " + hacker_id);
					return false;
				}
			}
		}
		return true;
	}

	// returns true if insertion successfully
	// 	if hacker already found in table, won't insert
	//  each skill in skills of form: {"skill": <TEXT>, "rating": <INTEGER>}
	async insertHackerProfile(name, company, email, phone, skills) {
		console.log("inside");
		const possibleHackerID = await this.findHackerID(name, company, email, phone);
		if (possibleHackerID) {
			console.log("hacker already in table");
			return true;
		}
		const insertSuccess = await this.insert(name, company, email, phone);
		if (!insertSuccess) return false;
		const hacker_id = await this.findHackerID(name, company, email, phone);
		if (!hacker_id) return false;
		console.log("skills: " + JSON.stringify(skills));
		for (const i in skills) {
			const skillEntry = skills[i];
			console.log("looping at " + JSON.stringify(skillEntry));
			const skillInsertSuccess = await this.skillTable.insert(hacker_id, skillEntry["skill"], skillEntry["rating"]);
			if (!skillInsertSuccess) {
				console.log("skill " + skillEntry["skill"] + " failed to insert");
				return false;
			}
		}
		return true;
	}
	// returns true if insertion succeeded
	async insert(name, company, email, phone) {
		const sql = `INSERT INTO hackers (name, company, email, phone)
                     VALUES(?,?,?,?)`;
		const runSuccess = await dbRunMethodPromise(this.db, sql, [name, company, email, phone]);
		if (runSuccess) {
			console.log("hacker added successfully");
			return true;
		}
		console.log("hacker insert failed");
		return false;
	}

	// returns true if run successfully
	async remove(hacker_id) {
		const sql = `DELETE FROM hackers
					 WHERE hacker_id = ?`;
		const runSuccess = await dbRunMethodPromise(this.db, sql, [hacker_id]);
		if (runSuccess) {
			console.log("hacker deleted successfully");
			return true;
		}
		return false;
	}

	// finds the hacker_id for the given personal info, returns null if not found
	async findHackerID(name, company, email, phone) {
		try {
			const sql = `SELECT hacker_id
						 FROM hackers
						 WHERE name = ? AND company = ? AND email = ? AND phone = ?`;
			const id = await dbGetMethodPromise(this.db, sql, [name, company, email, phone]);
			if (!id) {
				console.log("couldn't find hacker");
				return null;
			}
			console.log("hacker found");
			return id["hacker_id"];
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

class SkillTable {
	constructor(db) {
		this.db = db;
	}

	// returns list of skills of form {"name": <TEXT>, "frequency": <INTEGER>}
	async getAllSkills(min, max) {
		const sql = ``;
	}

	// returns list of skill entries of form {"hacker_id": <INTGER>, "skill": <TEXT>, "rating": <Integer>}
	async getHackerSkills(hacker_id) {
		const sql = `SELECT skill, rating 
					 FROM skills
					 WHERE hacker_id = ?`;
		const rows = await dbAllMethodPromise(this.db, sql, [hacker_id]);
		if (!rows) {
			console.log("no skills found for hacker_id: " + hacker_id);
		}
		// console.log("Found skills: " + JSON.stringify(rows));
		return rows;
	}

	// returns true if insertion successful
	// 	will update skill rating if hacker_id, skill pairing already exists in table
	async insert(hacker_id, skill, rating) {
		const skillEntries = await this.getHackerSkills(hacker_id);
		var found = false;
		console.log("skillEntries: " + JSON.stringify(skillEntries));
		for (const i in skillEntries) {
			const skillEntry = skillEntries[i];
			console.log("skillEntry: " + JSON.stringify(skillEntry));
			if (skill == skillEntry["skill"]) {
				found = true;
				const sql = `UPDATE skills
							 SET rating = ?
							 WHERE skill = ? AND hacker_id = ?`;
				const runSuccess = await dbRunMethodPromise(this.db, sql, [rating, skill, hacker_id]);
				if (runSuccess) {
					console.log("skill updated successfully");
					return true;
				}
				console.log("skill update failed");
				return false;
			}
		}
		if (!found) {
			const sql = `INSERT INTO skills (hacker_id, skill, rating)
					 VALUES(?,?,?)`;
			const runSuccess = await dbRunMethodPromise(this.db, sql, [hacker_id, skill, rating]);
			if (runSuccess) {
				console.log(`skill ${skill} added successfully`);
				return true;
			}
			console.log("skill insert failed");
			return false;
		}
	}

	// returns true if deletion successful
	async remove(hacker_id, skill) {
		const sql = `DELETE FROM skills
					 WHERE hacker_id = ? AND skill = ?`;
		const runSuccess = await dbRunMethodPromise(this.db, sql, [hacker_id, skill]);
		if (runSuccess) {
			console.log("skill deleted successfully");
			return true;
		}
		return false;
	}
}

async function loadData(hackerTable) {
	fs.readFile('./data.json', 'utf8', async (err, jsonString) => {
		if (err) {
			console.log("File read failed:", err);
			return;
		}
		try {
			const data = JSON.parse(jsonString);
			// console.log("data: " + data);
			for (const i in data) {
				const value = data[i];
				const result = await hackerTable.insertHackerProfile(value["name"], value["company"], value["email"], value["phone"], value["skills"]);
				if (!result) console.log("failed to insert profile");
			}
		} catch (err) {
			console.log("Error parsing JSON", err);
		}
	});
	return true;
}

export { loadData, connectDB, HackerTable, SkillTable };