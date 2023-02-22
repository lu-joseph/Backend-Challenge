import { connectDB, dbRunMethodPromise } from './src/db.js';
import { HackersTable } from './src/HackersTable.js';
import { SkillsTable } from './src/SkillsTable.js';
import fs from "fs";
import { EventsTable } from './src/EventsTable.js';
import { InvolvementsTable } from './src/InvolvementsTable.js';

const dbFile = "hackers.db";
const hackerDataFile = "./hackerData.json";
const eventsFile = "./events.json";

const database = connectDB(dbFile);

// returns promise for JSON extracted from file
async function extractJSONPromise(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                reject(err);
            }
            try {
                const data = JSON.parse(jsonString);
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    });
}

// sets up hackers table
async function setupHackersTable() {
    const dropHackersResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS hackers;`, []);
    const createHackersResult = await dbRunMethodPromise(database,
        `CREATE TABLE hackers (
            hacker_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            company TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL
        );`, []);
    return true;
}

// sets up skills table
async function setupSkillsTable() {
    const dropSkillsResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS skills;`, []);
    const createSkillsResult = await dbRunMethodPromise(database,
        `CREATE TABLE skills (
            hacker_id INTEGER NOT NULL,
            skill TEXT NOT NULL,
            rating INTEGER NOT NULL,
            FOREIGN KEY(hacker_id) REFERENCES hackers(hacker_id)
        );`, []);
    return true;
}

// sets up events table
async function setupEventsTable() {
    const dropEventsResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS events;`, []);
    const createEventsResult = await dbRunMethodPromise(database,
        `CREATE TABLE events (
            event_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );`, []);
    return true;
}

// sets up involvements table
async function setupInvolvementsTable() {
    const dropInvolvementsResult = await dbRunMethodPromise(database, `DROP TABLE IF EXISTS involvements;`, []);
    const createInvolvementsResult = await dbRunMethodPromise(database,
        `CREATE TABLE involvements (
            involvement_id INTEGER PRIMARY KEY,
            hacker_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            FOREIGN KEY(hacker_id) REFERENCES hackers(hacker_id),
            FOREIGN KEY(event_id) REFERENCES events(event_id)
        );`, []);
    return true;
}


// given an array of event_ids, randomly chooses up to 1/4 of them
function chooseEvents(eventIDs) {
    const numEventsAttended = Math.round(Math.random() * eventIDs.length / 4); // for purposes of testing, each hacker attends at most 1/4 of all events
    const eventsCopy = [...eventIDs];
    const eventsAttended = [];
    for (let i = 0; i < numEventsAttended; i++) {
        const idx = Math.round(Math.random() * (eventsCopy.length - 1));
        eventsAttended.push(eventsCopy[idx]);
        eventsCopy.splice(idx, 1);
    }
    return eventsAttended;
}


// returns an array of the event_ids inserted
async function insertEvents(eventData, eventsTable) {
    const eventIDs = [];
    for (const i in eventData) {
        const value = eventData[i];
        const name = value["name"];
        const insertResult = await eventsTable.insert(name);
        if (insertResult == {}) {
            console.log("failed to insert event");
            return false;
        }
        const id = await eventsTable.findID(name);
        eventIDs.push(id);
    }
    return eventIDs;
}

// returns true if involvements for hacker inserted successfully, otherwise false
async function insertInvolvements(eventIDs, involvementsTable, hacker_id) {
    console.log("hacker_id: " + hacker_id);
    const eventsAttended = chooseEvents(eventIDs);
    for (const idx of eventsAttended) {
        const insertResult = await involvementsTable.insert(hacker_id, idx);
        if (insertResult == {}) {
            console.log("failed to insert involvement");
            return false;
        }
    }
    return true;
}

// inserts data into hackers table and involvements table, for a given hacker
//  returns true if successful, false otherwise
async function insertHackerData(value, eventIDs, hackerTable, involvementsTable) {
    const result = await hackerTable.insertHackerProfile(value["name"], value["company"], value["email"], value["phone"], value["skills"]);
    if (!result) {
        console.log("failed to insert profile");
        return false;
    }
    const hacker_id = await hackerTable.findHackerID(value["name"], value["company"], value["email"], value["phone"]);
    const involvementsResult = await insertInvolvements(eventIDs, involvementsTable, hacker_id);
    if (!involvementsResult) {
        return false;
    }
    return true;
}


// sets up the tables
async function loadData() {
    const hackersResult = await setupHackersTable();
    const skillsResult = await setupSkillsTable();
    const eventsResult = await setupEventsTable();
    const involvementsResult = await setupInvolvementsTable();

    const skillsTable = new SkillsTable(database);
    const involvementsTable = new InvolvementsTable(database);
    const eventsTable = new EventsTable(database, involvementsTable);
    const hackerTable = new HackersTable(database, skillsTable, involvementsTable, eventsTable);

    const eventData = await extractJSONPromise(eventsFile);
    const eventIDs = await insertEvents(eventData, eventsTable);

    const hackerData = await extractJSONPromise(hackerDataFile);
    for (const i in hackerData) {
        const value = hackerData[i];
        const insertSuccess = await insertHackerData(value, eventIDs, hackerTable, involvementsTable);
        if (!insertSuccess) return;
    }
}

loadData();
