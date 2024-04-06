const express = require("express");
const app = express();

const logger = require("./middlewares/middlewares")
const { getStatus } = require("./controllers/players.controller")

  
  app.use(express.json());
  
  app.use(logger);

  app.get("/api", getStatus);

  module.exports = app