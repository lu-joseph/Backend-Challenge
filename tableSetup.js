import { connectDB, dbRunMethodPromise } from './src/db.js';
import { HackersTable } from './src/HackersTable.js';
import { SkillsTable } from './src/SkillsTable.js';
import fs from "fs";

const dbFile = "hackers.db";
const dataFile = './data.json';

const database = connectDB(dbFile);

async function loadData() {
    const dropHackersResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS hackers;`, []);
    const createHackersResult = await dbRunMethodPromise(database,
        `CREATE TABLE hackers (
            hacker_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            company TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL
        );`, []);
    const dropSkillsResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS skills;`, []);
    const createSkillsResult = await dbRunMethodPromise(database,
        `CREATE TABLE skills (
            hacker_id INTEGER NOT NULL,
            skill TEXT NOT NULL,
            rating INTEGER NOT NULL
        );`, []);

    const skillsTable = new SkillsTable(database);
    const hackerTable = new HackersTable(database, skillsTable);

    fs.readFile(dataFile, 'utf8', async (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            for (const i in data) {
                const value = data[i];
                const result = await hackerTable.insertHackerProfile(value["name"], value["company"], value["email"], value["phone"], value["skills"]);
                if (!result) {
                    console.log("failed to insert profile");
                    return false;
                }
            }
        } catch (err) {
            console.log("Error parsing JSON", err);
        }
    });
    return true;
}

loadData();
