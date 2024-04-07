const express = require("express");
const app = express();

const logger = require("./middlewares/middlewares");
const {
	getStatus,
	getPlayer,
	getFSRank1v1,
	getFSRankTg,
	getFSRankMax,
} = require("./controllers/players.controller");

app.use(express.json());

app.use(logger);

app.get("/api", getStatus);

app.get("/api/player", getPlayer);

app.get("/api/rankFS1v1", getFSRank1v1);

app.get("/api/rankFSTg", getFSRankTg);

app.get("/api/rankFSMax", getFSRankMax);

module.exports = app;
