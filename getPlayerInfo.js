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

function getPlayerInfo(playerId, leaderboard_id = 3) {
	return new Promise(function (resolve, reject) {
		playerRequest({
			method: "get",
			url: "https://data.aoe2companion.com/api/nightbot/rank?",
			params: {
				leaderboard_id: leaderboard_id,
				profile_id: playerId,
			},
		})
			.then((ranking) => {
				resolve(ranking.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

function getAllPlayers() {
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

function makeRanking(leaderboard_id) {
	return getAllPlayers().then((data) => {
		return Promise.all(
			data.map((player) => getPlayerInfo(player, leaderboard_id))
		)
			.then((players) => {
				let ranking = [];

				players.forEach((player) => {
					if (player !== undefined && player !== "Player not found") {
						nicknames = /[\[Fs\] a-zA-Z0-9 ]{1,}/; // Regex to validate nicknames
						ELO = /\([^\d]*(\d+)[^\d]*\)/;

						let nick = player.match(nicknames); // Fetch the nickname from the result string

						let getElo = player.match(ELO); // Fectch the ELO from the result string with (xxxx)

						let elo = getElo[0].match(/\(([^)]+)\)/); // Remove the parenthesis from the ELO string

						if (nick !== null) {
							ranking.push({
								nickname: nick[0].trim(),
								elo: Number(elo[1]),
							});
						}
					}
				});

				ranking = ranking.sort((a, b) => b.elo - a.elo);
				return ranking;
			})
			.catch((err) => {
				console.log("Error resolving players: ", err);
			});
	});
}

makeRanking(3)
	.then((ranking) => {
		//You can manipulate the ranking with the ranking object.
		console.log(ranking);
	})
	.catch((err) => {
		console.log("Error generating the ranking: ", err);
	});
