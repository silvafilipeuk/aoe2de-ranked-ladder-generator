const { getPlayerInfo } = require("../models/players.models");

function getStatus(req, res, next) {
	res.status(200).json({ server: "Live and listening..." });
}

function getPlayer(req, res, next) {
	const player = req.query;

	getPlayerInfo(player)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
}

module.exports = { getStatus, getPlayer };
