import { dbAllMethodPromise, dbRunMethodPromise } from "./db.js";

class SkillsTable {
    constructor(db) {
        this.db = db;
    }

    // returns list of skills of form {"name": <TEXT>, "frequency": <INTEGER>}
    async getAllSkills(min, max) {
        const sql = `SELECT skill name, COUNT(skill) frequency 
					 FROM skills 
					 GROUP BY skill
					 HAVING frequency BETWEEN ? AND ?`;
        const rows = await dbAllMethodPromise(this.db, sql, [min, max]);
        const skills = [];
        if (!rows) {
            console.log("no entries");
        } else {
            for (const i in rows) {
                const row = rows[i];
                skills.push(row);
            }
        }
        return skills;
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

export { SkillsTable };