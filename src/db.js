
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

// returns a promise for a run of the given query using the all() method for the database
function dbAllMethodPromise(db, query, params) {
	return new Promise((resolve, reject) => {
		db.all(query, params, (err, rows) => {
			if (err) {
				console.log("database all() method error");
				reject(err);
			}
			resolve(rows);
		});
	});
}



export { dbAllMethodPromise, dbGetMethodPromise, dbRunMethodPromise, connectDB }; 