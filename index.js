import express from "express";
import bodyParser from "body-parser";
import Joi from 'joi';
import { connectDB } from "./src/db.js";
import { HackersTable } from "./src/HackersTable.js";
import { SkillsTable } from "./src/SkillsTable.js";
import { schemas } from "./src/schemas.js";
import { validateBodySchema, validateIntegerParam, validateInteger } from "./src/RouterMiddleware.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const database = connectDB("hackers.db");

const skills = new SkillsTable(database);
const hackers = new HackersTable(database, skills);

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
	res.status(200).json(newProfile);
});

app.get("/skills", async (req, res) => {
	var min = req.query.min_frequency;
	var max = req.query.max_frequency;
	if (validateInteger(min, res) && validateInteger(max, res)) {
		min = parseInt(min);
		max = parseInt(max);
		const skillsList = await skills.getAllSkills(min, max);
		if (!skillsList) console.log("no skills match query");
		res.json(skillsList);
	}
});

app.put("/skills/", validateBodySchema(schemas.newSkillSchema), async (req, res) => {
	const request = req.body;
	const hacker_id = request["hacker_id"];
	const skill = request["skill"];
	const rating = request["rating"];
	const result = await skills.insertOrUpdate(hacker_id, skill, rating);
	if (!result) console.log("insert failed");
	res.json({});
});

app.listen(port, () => {
	console.log(`Example REST Express app listening at http://localhost:${port}`);
});


