const infoRequest = require("axios");

function getPlayerInfo(player) {
	const playerInfoUrl = `https://aoe-api.reliclink.com/community/leaderboard/GetPersonalStat?title=age2`;
	let parameters = {};

	if (player.hasOwnProperty("steam_id")) {
		parameters = {
			profile_names: `["/steam/${player.steam_id}"]`,
		};
	} else
		parameters = {
			aliases: `[${player.nickname}]`,
		};

	return new Promise(function (resolve, reject) {
		infoRequest({
			method: "get",
			url: playerInfoUrl,
			params: parameters,
		})
			.then((playerInfo) => {
				console.log(playerInfo);
				const playerData = {
					nick: playerInfo.data.statGroups[0].members[0].alias,
					country: playerInfo.data.statGroups[0].members[0].country,
					rm1v1Stats: {
						rating: playerInfo.data.leaderboardStats[0].rating,
						wins: playerInfo.data.leaderboardStats[0].wins,
						losses: playerInfo.data.leaderboardStats[0].losses,
						streak: playerInfo.data.leaderboardStats[0].streak,
						drops: playerInfo.data.leaderboardStats[0].drops,
						highestrating:
							playerInfo.data.leaderboardStats[0].highestrating,
					},
					rmTGStats: {
						rating: playerInfo.data.leaderboardStats[1].rating,
						wins: playerInfo.data.leaderboardStats[1].wins,
						losses: playerInfo.data.leaderboardStats[1].losses,
						streak: playerInfo.data.leaderboardStats[1].streak,
						drops: playerInfo.data.leaderboardStats[1].drops,
						highestrating:
							playerInfo.data.leaderboardStats[1].highestrating,
					},
				};
				resolve(playerData);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

module.exports = { getPlayerInfo };
