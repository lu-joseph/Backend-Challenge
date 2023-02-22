import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./src/db.js";
import { HackersTable } from "./src/HackersTable.js";
import { SkillsTable } from "./src/SkillsTable.js";
import { schemas } from "./src/schemas.js";
import { validateBodySchema, validateIntegerParam, validateInteger } from "./src/RouterMiddleware.js";
import { InvolvementsTable } from "./src/InvolvementsTable.js";
import { EventsTable } from "./src/EventsTable.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const database = connectDB("hackers.db");

const skills = new SkillsTable(database);
const involvements = new InvolvementsTable(database);
const events = new EventsTable(database, involvements);
const hackers = new HackersTable(database, skills, involvements, events);

app.get("/users/", async (req, res) => {
	const result = await hackers.getAllHackers();
	res.status(200).json(result);
});

app.get("/users/:id/", validateIntegerParam("id"), async (req, res) => {
	const hacker_id = parseInt(req.params["id"]);
	const hacker = await hackers.getHacker(hacker_id);
	res.status(200).json(hacker);
});

app.put("/users/:id/", validateIntegerParam("id"), validateBodySchema(schemas.updateUserSchema), async (req, res) => {
	const hacker_id = parseInt(req.params["id"]);
	const update_request = req.body;
	const result = await hackers.updateHacker(hacker_id, update_request);
	if (!result) console.log("update failed");
	const newProfile = await hackers.getHacker(hacker_id);
	res.status(201).json(newProfile);
});

app.get("/skills", async (req, res) => {
	var min = req.query.min_frequency;
	var max = req.query.max_frequency;
	if (validateInteger(min, res) && validateInteger(max, res)) {
		min = parseInt(min);
		max = parseInt(max);
		const skillsList = await skills.getAllSkills(min, max);
		if (!skillsList) console.log("no skills match query");
		res.status(200).json(skillsList);
	}
});

app.put("/skills/", validateBodySchema(schemas.newSkillSchema), async (req, res) => {
	const request = req.body;
	const hacker_id = request["hacker_id"];
	const skill = request["skill"];
	const rating = request["rating"];
	const result = await skills.insertOrUpdate(hacker_id, skill, rating);
	if (result != {}) console.log("insert failed");
	res.status(201).json(result);
});

app.get("/events/", async (req, res) => {
	const rows = await events.getAllEvents();
	res.status(200).json(rows);
});

app.get("/events/:id/", validateIntegerParam("id"), async (req, res) => {
	const event_id = parseInt(req.params["id"]);
	const eventsResult = await events.getEvent(event_id);
	res.status(200).json(eventsResult);
});

app.put("/events/attend/", validateBodySchema(schemas.eventAttendSchema), async (req, res) => {
	const request = req.body;
	const hacker_id = request["hacker_id"];
	const event_id = request["event_id"];
	const result = await involvements.insert(hacker_id, event_id);
	if (result == {}) {
		res.status(400).send("Invalid hacker_id and/or event_id");
	} else {
		res.status(201).json(result);
	}
});

app.listen(port, () => {
	console.log(`Example REST Express app listening at http://localhost:${port}`);
});


