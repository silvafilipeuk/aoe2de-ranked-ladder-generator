const express = require("express");
const cors = require("cors");
const app = express();

const logger = require("./middlewares/middlewares");
const {
	getStatus,
	getPlayer,
	getFSRank1v1,
	getFSRankTg,
	getFSRankMax,
	getFSRankEw,
} = require("./controllers/players.controller");

app.use(express.json());

app.use(cors());

app.use(logger);

app.get("/api", getStatus);

app.get("/api/player", getPlayer);

app.get("/api/rankFS1v1", getFSRank1v1);

app.get("/api/rankFSTg", getFSRankTg);

app.get("/api/rankFSMax", getFSRankMax);

app.get("/api/rankFSEw", getFSRankEw);

module.exports = app;
