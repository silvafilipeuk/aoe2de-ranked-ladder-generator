const playerRequest = require("axios");
const fs = require("fs");

// Rank aoe2.net API
// Request rank details about a player
//
// ! Request Parameters:
// * leaderboard_id (Optional, defaults to 3)
// * Leaderboard ID (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)
// * search (search, steam_id or profile_id required)
// * steam_id (search, steam_id or profile_id required)
// * steamID64 (ex: 76561199003184910)
// * profile_id (search, steam_id or profile_id required)
// * Profile ID (ex: 459658)

async function getPlayerInfo(playerId) {
	const res = await playerRequest({
		method: "get",
		url: "https://data.aoe2companion.com/api/nightbot/rank?",
		params: {
			leaderboard_id: 3,
			profile_id: playerId,
		},
	})
		.then((ranking) => {
			return ranking;
		})
		.catch((err) => {
			return err;
		});

	return res;
}

function getAllFsPlayers() {
	regex = /^([\[FsFS\]]{4}) ?([a-zA-Z0-9]*) ?([a-zA-Z0-9]*)*/; // Regex to validate [Fs] tag nicknames

	return new Promise(function (resolve, reject) {
		fs.readFile("./database/players.txt", "utf-8", (err, players) => {
			if (err) {
				reject(err);
			} else {
				const data = players.split("\n");
				resolve(data);
			}
		});
	});
}

getAllFsPlayers().then((data) => {
	Promise.all(data.map((player) => getPlayerInfo(player)))
		.then((players) => {
			players.forEach((player) => {
				if (
					player.data !== undefined &&
					player.data !== "Player not found"
				)
					console.log(player.data);
			});
		})
		.catch((err) => {
			console.log("Error resolving players: ", err);
		});
});
