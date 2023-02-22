import { dbAllMethodPromise, dbRunMethodPromise } from "./db.js";

class SkillsTable {
    constructor(db) {
        this.db = db;
    }

    // gets a list of skills in the table with their frequency
    // returns list of skills of form {"name": <TEXT>, "frequency": <INTEGER>}
    async getAllSkills(min, max) {
        const sql = `SELECT skill name, COUNT(skill) frequency 
					 FROM skills 
					 GROUP BY skill
					 HAVING frequency BETWEEN ? AND ?`;
        const rows = await dbAllMethodPromise(this.db, sql, [min, max]);
        const skills = [];
        rows.forEach((row) => { skills.push(row) });
        return skills;
    }

    // gets a list of a hacker's skills
    // returns list of skill entries of form {"hacker_id": <INTGER>, "skill": <TEXT>, "rating": <Integer>}
    async getHackerSkills(hacker_id) {
        const sql = `SELECT skill, rating 
					 FROM skills
					 WHERE hacker_id = ?`;
        const rows = await dbAllMethodPromise(this.db, sql, [hacker_id]);
        if (!rows) {
            console.log("no skills found for hacker_id: " + hacker_id);
        }
        return rows;
    }

    // inserts row into skills table
    // returns the new skill if insertion successful
    //      should not be called if (hacker_id, skill) pairing already in table
    async insert(hacker_id, skill, rating) {
        const sql = `INSERT INTO skills (hacker_id, skill, rating)
					 VALUES(?,?,?)`;
        const runSuccess = await dbRunMethodPromise(this.db, sql, [hacker_id, skill, rating]);
        if (runSuccess) {
            console.log(`skill ${skill} added successfully`);
            return JSON.parse(`{"skill": "${skill}", "rating": ${rating}}`);
        }
        console.log("skill insert failed");
        return {};
    }

    // updates rating for the row in skills table, given hacker_id and skill
    // returns the new skill if update successful
    //      should only be called if (hacker_id, skill) pairing already in table
    async update(hacker_id, skill, rating) {
        const sql = `UPDATE skills
                     SET rating = ?
                     WHERE skill = ? AND hacker_id = ?`;
        const runSuccess = await dbRunMethodPromise(this.db, sql, [rating, skill, hacker_id]);
        if (runSuccess) {
            console.log("skill updated successfully");
            return JSON.parse(`{"skill":${skill}, "rating":${rating}}`);
        }
        console.log("skill update failed");
        return {};
    }

    // looks for (hacker_id, skill) pairing: if exists, updates rating, otherwise insert entry
    // returns the new skill if insertion/update successful
    async insertOrUpdate(hacker_id, skill, rating) {
        const skillEntries = await this.getHackerSkills(hacker_id);
        for (const i in skillEntries) {
            const skillEntryName = skillEntries[i]["skill"];
            if (skill == skillEntryName) {
                return await this.update(hacker_id, skill, rating);
            }
        }
        return await this.insert(hacker_id, skill, rating);
    }

    // deletes a row in skills table given hacker_id, skill
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