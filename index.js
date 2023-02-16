import express from "express";
import bodyParser from "body-parser";
import { loadData, connectDB } from "./src/db.js";
import { HackersTable } from "./src/HackersTable.js";
import { SkillsTable } from "./src/SkillsTable.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const database = connectDB("hackers.db");

const skills = new SkillsTable(database);
const hackers = new HackersTable(database, skills);

// app.get("/", async (req, res) => {
// 	const result = await loadData(hackers);
// 	res.send("Hello World!");
// });

app.get("/users/", async (req, res) => {
	const hackersList = await hackers.getAllHackers();
	res.json(hackersList);
});

app.get("/users/:id/", async (req, res) => {
	const hacker_id = parseInt(req.params["id"]);
	const hacker = await hackers.getHacker(hacker_id);
	res.json(hacker);
});

app.put("/users/:id/", async (req, res) => {
	const hacker_id = parseInt(req.params["id"]);
	const update_request = req.body;
	const result = await hackers.updateHacker(hacker_id, update_request);
	if (!result) console.log("update failed");
	const newProfile = await hackers.getHacker(hacker_id);
	res.json(newProfile);
});

app.get("/skills", async (req, res) => {
	const min = parseInt(req.query.min_frequency);
	const max = parseInt(req.query.max_frequency);
	const skillsList = await skills.getAllSkills(min, max);
	if (!skillsList) console.log("no skills match query");
	res.json(skillsList);
});

app.put("/skills/:id/:skill/:rating/", async (req, res) => {
	const hacker_id = parseInt(req.params["id"]);
	const skill = req.params["skill"];
	const rating = parseInt(req.params["rating"]);
	const result = await skills.insert(hacker_id, skill, rating);
	if (!result) console.log("insert failed");
	res.json({});
});

app.listen(port, () => {
	console.log(`Example REST Express app listening at http://localhost:${port}`);
});


