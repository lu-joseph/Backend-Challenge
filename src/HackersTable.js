import { dbGetMethodPromise, dbAllMethodPromise, dbRunMethodPromise } from "./db.js";

class HackersTable {
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

export { HackersTable };