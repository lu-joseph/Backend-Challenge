import { dbGetMethodPromise, dbAllMethodPromise, dbRunMethodPromise } from "./db.js";

class HackersTable {
    constructor(db, skillTable, involvementTable, eventsTable) {
        this.db = db;
        this.skillTable = skillTable;
        this.involvementTable = involvementTable;
        this.eventsTable = eventsTable;
    }

    // returns user profile for hacker_id
    //      if no hacker with hacker_id found, returns {}
    async getHacker(hacker_id) {
        const sql = `SELECT name, company, email, phone
					 FROM hackers
					 WHERE hacker_id = ?`;
        const row = await dbGetMethodPromise(this.db, sql, [hacker_id]);
        var profile = {};
        if (!row) {
            console.log(`hacker_id ${hacker_id} not found`);
            return profile;
        }
        const skills = [];
        const skillrows = await this.skillTable.getHackerSkills(hacker_id);
        skillrows.forEach((skill) => { skills.push(JSON.stringify(skill)) });
        const eventIDs = await this.involvementTable.getEvents(hacker_id);
        const events = [];
        for (const i in eventIDs) {
            const event_id = eventIDs[i];
            const event = await this.eventsTable.getEvent(event_id)
            events.push(JSON.stringify(event));
        }
        profile = JSON.parse(`{
                                    "name": "${row.name}",
                                    "company": "${row.company}",
                                    "email": "${row.email}",
                                    "phone": "${row.phone}",
                                    "skills": [${skills}],
                                    "events": [${events}]
                              }`);
        return profile;
    }

    // returns the list of hacker profiles
    async getAllHackers() {
        const sql = `SELECT hacker_id
					 FROM hackers`;
        const result = await dbAllMethodPromise(this.db, sql, []);
        const profiles = [];
        if (!result)
            return profiles;
        for (const i in result) {
            const hacker_id = parseInt(result[i]["hacker_id"]);
            const profile = await this.getHacker(hacker_id);
            profiles.push(profile);
        }
        return profiles;
    }

    // updates row in hackers table
    // returns true if update succeeded
    async updateHackerRow(hacker_id, property, value) {
        const sql = `UPDATE hackers
							 SET ${property} = ? 
							 WHERE hacker_id = ?`;
        const runResult = await dbRunMethodPromise(this.db, sql, [value, hacker_id]);
        if (!runResult) {
            console.log("Unable to update " + property + " for hacker_id " + hacker_id);
            return false;
        }
        return true;
    }

    // given request json, 
    // returns true if update succeeded
    async updateHacker(hacker_id, request) {
        for (const property in request) {
            if (property == "skills") {
                const skills = request[property];
                for (const i in skills) {
                    const skillEntry = skills[i];
                    const insertResult = await this.skillTable.insert(hacker_id, skillEntry["skill"], skillEntry["rating"]);
                    if (!insertResult) {
                        console.log("unable to insert skill " + skillEntry["skill"]);
                        return false;
                    }
                }
            } else {
                const updateSuccess = await this.updateHackerRow(hacker_id, property, request[property]);
                if (!updateSuccess) return false
            }
        }
        return true;
    }

    // returns true if insertion successfully
    // 	if hacker already found in table, won't insert
    //  each skill in skills of form: {"skill": <TEXT>, "rating": <INTEGER>}
    async insertHackerProfile(name, company, email, phone, skills) {
        const possibleHackerID = await this.findHackerID(name, company, email, phone);
        if (possibleHackerID) {
            console.log("hacker already in table");
            return true;
        }
        const insertSuccess = await this.insert(name, company, email, phone);
        if (!insertSuccess) return false;
        const hacker_id = await this.findHackerID(name, company, email, phone);
        if (!hacker_id) return false;
        for (const i in skills) {
            const skillEntry = skills[i];
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

export { HackersTable };