import { dbGetMethodPromise, dbAllMethodPromise, dbRunMethodPromise } from "./db.js";


class EventsTable {
    constructor(db, involvementsTable) {
        this.db = db;
        this.involvementsTable = involvementsTable;
    }

    // inserts row into events table
    // returns the new event if insertion successful
    async insert(name) {
        const sql = `INSERT INTO events (name)
					 VALUES(?)`;
        const runSuccess = await dbRunMethodPromise(this.db, sql, [name]);
        if (runSuccess) {
            console.log(`event ${name} added successfully`);
            return JSON.parse(`{"name": "${name}"}`);
        }
        console.log("event insert failed");
        return {};
    }

    // returns the id of the event with name
    async findID(name) {
        const sql = `SELECT event_id
                     FROM events
                     WHERE name = ?`;
        const row = await dbGetMethodPromise(this.db, sql, [name]);
        if (!row) {
            console.log("find event id failed");
            return false;
        }
        return row["event_id"];
    }

    // returns event 
    async getEvent(event_id) {
        const sql = `SELECT name
                     FROM events
                     WHERE event_id = ?`;
        const row = await dbGetMethodPromise(this.db, sql, [event_id]);
        const hackers = await this.involvementsTable.getHackers(event_id);
        return JSON.parse(`{"name": "${row["name"]}", "hackers": [${hackers}]}`);
    }

    // returns list of events and their attendances
    async getAllEvents() {
        const sql = `SELECT events.name, COUNT(involvements.hacker_id) attendance 
					 FROM events
                     LEFT JOIN involvements ON events.event_id = involvements.event_id
					 GROUP BY events.name`;
        const rows = await dbAllMethodPromise(this.db, sql, []);
        return rows;
    }
}

export { EventsTable };