import fs from "fs";
import sqlite3 from "sqlite3";

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

export { dbAllMethodPromise, dbGetMethodPromise, dbRunMethodPromise, loadData, connectDB }; 