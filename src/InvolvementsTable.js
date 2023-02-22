import { dbGetMethodPromise, dbAllMethodPromise, dbRunMethodPromise } from "./db.js";

class InvolvementsTable {
    constructor(db) {
        this.db = db;
    }

    // inserts row into involvements table
    // returns the new involvement if insertion successful
    async insert(hacker_id, event_id) {
        const sql = `INSERT INTO involvements (hacker_id, event_id)
					 VALUES(?, ?)`;
        const runSuccess = await dbRunMethodPromise(this.db, sql, [hacker_id, event_id]);
        if (runSuccess) {
            console.log(`involvement (${hacker_id}, ${event_id}) added successfully`);
            return JSON.parse(`{"hacker_id": "${hacker_id}", "event_id": "${event_id}"}`);
        }
        console.log("event insert failed");
        return {};
    }

    // finds all events that a given hacker is involved in
    async getEvents(hacker_id) {
        const sql = `SELECT event_id
                     FROM involvements
                     WHERE hacker_id = ?
                     ORDER BY event_id ASC`;
        const rows = await dbAllMethodPromise(this.db, sql, [hacker_id]);
        if (!rows) {
            return null;
        }
        const eventIDs = rows.map((row) => { return row["event_id"] });
        return eventIDs;
    }

    // finds all hackers attending a given event
    async getHackers(event_id) {
        const sql = `SELECT hacker_id
                     FROM involvements
                     WHERE event_id = ?
                     ORDER BY hacker_id ASC`;
        const rows = await dbAllMethodPromise(this.db, sql, [event_id]);
        if (!rows) {
            return null;
        }
        const hackerIDs = rows.map((row) => { return row["hacker_id"] });
        return hackerIDs;
    }
}

export { InvolvementsTable };