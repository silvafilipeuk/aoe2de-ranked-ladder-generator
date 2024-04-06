const express = require("express");
const app = express();

const logger = require("./middlewares/middlewares");
const { getStatus, getPlayer } = require("./controllers/players.controller");

app.use(express.json());

app.use(logger);

app.get("/api", getStatus);

app.get("/api/player", getPlayer);

module.exports = app;
